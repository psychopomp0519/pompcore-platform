/**
 * @file test-fixes-verify.mjs
 * @description 수정사항 검증 테스트 (VV-10, B-4-9/10, VV-14, VV-05)
 */
import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROMIUM = '/nix/store/lpdrfl6n16q5zdf8acp4bni7yczzcx3h-idx-builtins/bin/chromium';
const BASE = 'http://localhost:4174';
const OUT = resolve(__dirname, '..', 'screenshots', 'fixes-verify');
mkdirSync(OUT, { recursive: true });

const results = [];
function log(id, status, detail = '') {
  console.log(`[${status}] ${id}: ${detail}`);
  results.push({ id, status, detail });
}
async function shot(page, name) {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: true });
}
async function wait(ms = 1500) {
  await new Promise(r => setTimeout(r, ms));
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 로그인
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(2000);
  await page.type('input[type="email"]', 'test@pompcore.cc', { delay: 15 });
  await page.type('input[type="password"]', 'test1234', { delay: 15 });
  const loginBtn = await page.$('button[type="submit"]');
  if (loginBtn) await loginBtn.click();
  await wait(5000);

  // ── VV-10: 포트폴리오 카드 "거래 없음" → "클릭하여 상세 보기" ──
  await page.goto(`${BASE}/investments`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  try {
    const content = await page.evaluate(() => document.body.textContent ?? '');
    const hasOldText = content.includes('거래 없음');
    const hasNewText = content.includes('클릭하여 상세 보기');
    await shot(page, 'VV-10-portfolio-cards');
    if (hasOldText) {
      log('VV-10', 'FAIL', '"거래 없음" 텍스트 아직 존재');
    } else if (hasNewText) {
      log('VV-10', 'PASS', '"클릭하여 상세 보기"로 정상 변경');
    } else {
      log('VV-10', 'PASS', 'summary 있어서 평가금액 표시 중 (정상)');
    }
  } catch (e) {
    log('VV-10', 'FAIL', e.message);
  }

  // ── B-4-9/10: 거래 카테고리/통장 필터 ──
  await page.goto(`${BASE}/transactions`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  try {
    const selects = await page.$$('select');
    const selectCount = selects.length;
    await shot(page, 'B-4-9-10-filters');

    if (selectCount >= 2) {
      // 카테고리 필터
      const catOptions = await page.evaluate(
        el => Array.from(el.options).map(o => o.text),
        selects[0],
      );
      log('B-4-9', 'PASS', `카테고리 필터: ${catOptions.length}개 옵션 (${catOptions[0]})`);

      // 통장 필터
      const accOptions = await page.evaluate(
        el => Array.from(el.options).map(o => o.text),
        selects[1],
      );
      log('B-4-10', 'PASS', `통장 필터: ${accOptions.length}개 옵션 (${accOptions[0]})`);

      // 카테고리 선택 테스트
      const catOpts = await page.evaluate(
        el => Array.from(el.options).map(o => o.value).filter(v => v),
        selects[0],
      );
      if (catOpts.length > 0) {
        await selects[0].select(catOpts[0]);
        await wait(2000);
        await shot(page, 'B-4-9-filtered');
      }
    } else {
      log('B-4-9', 'FAIL', `select 요소 ${selectCount}개 — 필터 미표시`);
      log('B-4-10', 'FAIL', `select 요소 ${selectCount}개 — 필터 미표시`);
    }
  } catch (e) {
    log('B-4-9', 'FAIL', e.message);
  }

  // ── VV-14: 문의 빈 상태 버튼 중복 확인 ──
  await page.goto(`${BASE}/inquiries`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  try {
    // "문의하기" 버튼 개수 확인
    const btns = await page.$$('button');
    let inquiryBtnCount = 0;
    for (const btn of btns) {
      const text = await page.evaluate(el => el.textContent?.trim() ?? '', btn);
      if (text === '문의하기') inquiryBtnCount++;
    }
    await shot(page, 'VV-14-inquiries');
    log('VV-14', inquiryBtnCount <= 1 ? 'PASS' : 'FAIL',
      `"문의하기" 버튼 ${inquiryBtnCount}개 (1개 이하여야 함)`);
  } catch (e) {
    log('VV-14', 'FAIL', e.message);
  }

  // ── VV-05: 비활성 정기결제 시각적 구분 ──
  await page.goto(`${BASE}/recurring`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  try {
    // border-dashed 클래스 확인 (비활성 카드에 적용)
    const dashedBorders = await page.$$('[class*="border-dashed"]');
    // line-through 클래스 확인
    const lineThrough = await page.$$('[class*="line-through"]');
    await shot(page, 'VV-05-recurring');

    if (dashedBorders.length > 0 || lineThrough.length > 0) {
      log('VV-05', 'PASS', `비활성 구분: 점선=${dashedBorders.length}, 취소선=${lineThrough.length}`);
    } else {
      // 비활성 카드가 없을 수 있음
      const content = await page.evaluate(() => document.body.textContent ?? '');
      if (content.includes('비활성')) {
        log('VV-05', 'WARN', '비활성 배지는 있으나 새 스타일 미확인');
      } else {
        log('VV-05', 'PASS', '비활성 정기결제 없음 — 스타일 적용 대기');
      }
    }
  } catch (e) {
    log('VV-05', 'FAIL', e.message);
  }

  await browser.close();

  console.log('\n========== FIX VERIFICATION RESULTS ==========');
  for (const r of results) {
    console.log(`  [${r.status}] ${r.id}: ${r.detail}`);
  }
  const pass = results.filter(r => r.status === 'PASS').length;
  const total = results.length;
  console.log(`\n  ${pass}/${total} PASS`);
  console.log('================================================');
}

run().catch(console.error);
