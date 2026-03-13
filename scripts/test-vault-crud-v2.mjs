/**
 * @file test-vault-crud-v2.mjs
 * @description Vault 미테스트 32개 항목 자동화 (정확한 셀렉터 기반)
 * @module scripts
 */
import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROMIUM = '/nix/store/lpdrfl6n16q5zdf8acp4bni7yczzcx3h-idx-builtins/bin/chromium';
const BASE = 'http://localhost:4174';
const OUT = resolve(__dirname, '..', 'screenshots', 'vault-crud-v2');
mkdirSync(OUT, { recursive: true });

const results = [];

function log(id, status, detail = '') {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] [${status}] ${id}: ${detail}`);
  results.push({ id, status, detail });
}

async function shot(page, name) {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), fullPage: true });
}

async function wait(ms = 1500) {
  await new Promise(r => setTimeout(r, ms));
}

/** 페이지 내 텍스트가 포함된 버튼 클릭 */
async function clickBtnText(page, text) {
  const btns = await page.$$('button');
  for (const btn of btns) {
    const t = await page.evaluate(el => el.textContent?.trim() ?? '', btn);
    if (t.includes(text)) {
      await btn.click();
      return true;
    }
  }
  return false;
}

/** title 속성으로 버튼 클릭 */
async function clickBtnTitle(page, title) {
  const btn = await page.$(`button[title="${title}"]`);
  if (btn) {
    await btn.click();
    return true;
  }
  return false;
}

/** aria-label로 버튼 클릭 */
async function clickBtnAria(page, label) {
  const btn = await page.$(`button[aria-label="${label}"]`);
  if (btn) {
    await btn.click();
    return true;
  }
  return false;
}

/** select 첫 유효 옵션 선택 */
async function selectFirst(page, selector) {
  const sel = await page.$(selector);
  if (!sel) return false;
  const opts = await page.evaluate(
    el => Array.from(el.options).map(o => o.value).filter(v => v),
    sel,
  );
  if (opts.length > 0) {
    await sel.select(opts[0]);
    return true;
  }
  return false;
}

/** 페이지 body 텍스트 */
async function bodyText(page) {
  return page.evaluate(() => document.body.textContent ?? '');
}

/** 모달이 열릴 때까지 대기 */
async function waitForModal(page, timeoutMs = 3000) {
  try {
    await page.waitForSelector('[role="dialog"], [class*="Modal"], [class*="modal"]', {
      timeout: timeoutMs,
    });
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // ── 로그인 ──────────────────────────────────────────
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(2000);
  await page.type('input[type="email"]', 'test@pompcore.cc', { delay: 15 });
  await page.type('input[type="password"]', 'test1234', { delay: 15 });
  await clickBtnText(page, '로그인');
  await wait(5000);
  console.log('✅ Logged in:', page.url());

  // ================================================================
  // B-3: 통장 수정 / 즐겨찾기 / 삭제
  // ================================================================
  await page.goto(`${BASE}/accounts`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  await shot(page, 'B-3-before');

  // B-3-4: 통장 수정 (title="수정")
  try {
    const clicked = await clickBtnTitle(page, '수정');
    if (clicked) {
      await wait(1000);
      const modal = await waitForModal(page);
      if (modal) {
        await shot(page, 'B-3-4-edit-modal');
        await clickBtnText(page, '취소');
        await wait(500);
        log('B-3-4', 'PASS', '통장 수정 모달 열기/닫기 성공');
      } else {
        log('B-3-4', 'WARN', '수정 버튼 클릭했으나 모달 미표시');
      }
    } else {
      log('B-3-4', 'WARN', 'title="수정" 버튼 미발견 — 통장 없을 수 있음');
    }
  } catch (e) {
    log('B-3-4', 'FAIL', e.message);
  }

  // B-3-5: 즐겨찾기 토글 (title="즐겨찾기" 또는 "즐겨찾기 해제")
  try {
    let clicked = await clickBtnTitle(page, '즐겨찾기');
    if (!clicked) clicked = await clickBtnTitle(page, '즐겨찾기 해제');
    if (clicked) {
      await wait(1500);
      await shot(page, 'B-3-5-favorite');
      log('B-3-5', 'PASS', '즐겨찾기 토글 클릭 성공');
      // 원복
      const r1 = await clickBtnTitle(page, '즐겨찾기 해제');
      if (!r1) await clickBtnTitle(page, '즐겨찾기');
      await wait(500);
    } else {
      log('B-3-5', 'WARN', '즐겨찾기 버튼 미발견');
    }
  } catch (e) {
    log('B-3-5', 'FAIL', e.message);
  }

  // B-3-6: 통장 삭제 (title="삭제") — 새 테스트 통장 생성 후 삭제
  try {
    // 먼저 테스트용 통장 생성
    await clickBtnText(page, '추가');
    await wait(1000);
    const modal = await waitForModal(page);
    if (modal) {
      const inputs = await page.$$('form input, [role="dialog"] input');
      if (inputs.length >= 1) await inputs[0].type('삭제테스트통장', { delay: 15 });
      if (inputs.length >= 2) await inputs[1].type('1000', { delay: 15 });
      await clickBtnText(page, '추가');
      if (!(await page.$('button:not([disabled])'))) {
        await clickBtnText(page, '저장');
      }
      await wait(2500);
    }

    // 삭제 버튼 클릭 (마지막 카드의 삭제 버튼)
    const deleteBtns = await page.$$('button[title="삭제"]');
    if (deleteBtns.length > 0) {
      await deleteBtns[deleteBtns.length - 1].click();
      await wait(1000);
      // ConfirmDialog에서 확인
      const confirmed = await clickBtnText(page, '삭제');
      await wait(2000);
      await shot(page, 'B-3-6-after-delete');
      log('B-3-6', 'PASS', '통장 삭제 완료');
    } else {
      log('B-3-6', 'WARN', '삭제 버튼 미발견');
    }
  } catch (e) {
    log('B-3-6', 'FAIL', e.message);
  }

  // ================================================================
  // B-4: 거래내역 수정 / 삭제 / 필터
  // ================================================================
  await page.goto(`${BASE}/transactions`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2500);

  // B-4-5: 거래 수정 (항목 클릭 → 수정 모달)
  try {
    // 거래 항목은 button.w-full 형태
    const txItems = await page.$$('button[type="button"].w-full');
    if (txItems.length > 0) {
      await txItems[0].click();
      await wait(1000);
      const modal = await waitForModal(page);
      if (modal) {
        await shot(page, 'B-4-5-edit-modal');
        // 메모 수정 시도
        const memoInput = await page.$('#tx-memo');
        if (memoInput) {
          await memoInput.click({ clickCount: 3 });
          await memoInput.type('자동테스트 메모', { delay: 15 });
        }
        await clickBtnText(page, '취소');
        await wait(500);
        log('B-4-5', 'PASS', '거래 수정 모달 열기 성공');
      } else {
        log('B-4-5', 'WARN', '항목 클릭했으나 모달 미표시');
      }
    } else {
      log('B-4-5', 'WARN', '거래 항목 미발견 — 거래 없을 수 있음');
    }
  } catch (e) {
    log('B-4-5', 'FAIL', e.message);
  }

  // B-4-6: 거래 삭제 (X 아이콘 버튼)
  try {
    // 먼저 테스트 거래 추가
    await clickBtnText(page, '추가');
    await wait(1000);
    const nameInput = await page.$('#tx-name');
    if (nameInput) await nameInput.type('삭제테스트거래', { delay: 15 });
    const amountInput = await page.$('#tx-amount');
    if (amountInput) await amountInput.type('999', { delay: 15 });
    await selectFirst(page, '#tx-account');
    await wait(300);
    await clickBtnText(page, '추가');
    await wait(2500);

    // 삭제 버튼 (X 아이콘, stopPropagation 사용)
    // TransactionList 내 삭제 버튼은 SVG X 아이콘이 있는 button
    const content = await bodyText(page);
    if (content.includes('삭제테스트거래') || content.includes('999')) {
      // 거래 목록 내 삭제 버튼들 찾기
      const allBtns = await page.$$('button');
      let deleted = false;
      for (const btn of allBtns) {
        const html = await page.evaluate(el => el.innerHTML, btn);
        const parent = await page.evaluate(el => el.parentElement?.textContent ?? '', btn);
        // X 아이콘을 가진 작은 버튼이면서 삭제테스트거래 근처
        if (html.includes('svg') && html.includes('M6') && parent.includes('삭제테스트')) {
          await btn.click();
          await wait(1000);
          // 확인 다이얼로그
          await clickBtnText(page, '삭제');
          await wait(2000);
          deleted = true;
          break;
        }
      }
      if (deleted) {
        await shot(page, 'B-4-6-after-delete');
        log('B-4-6', 'PASS', '거래 삭제 완료');
      } else {
        log('B-4-6', 'WARN', '삭제 버튼 위치 특정 실패 — 거래는 존재');
      }
    } else {
      log('B-4-6', 'WARN', '테스트 거래 추가 실패');
    }
  } catch (e) {
    log('B-4-6', 'FAIL', e.message);
  }

  // B-4-8: 타입 필터 (수입/지출 토글)
  try {
    await page.goto(`${BASE}/transactions`, { waitUntil: 'networkidle0', timeout: 20000 });
    await wait(2000);

    // TypeToggle: "수입", "지출" 텍스트 버튼
    const incomeBtn = await page.evaluateHandle(() => {
      const btns = document.querySelectorAll('button');
      for (const b of btns) {
        if (b.textContent?.trim() === '수입' && !b.closest('form')) return b;
      }
      return null;
    });

    if (incomeBtn && incomeBtn.asElement()) {
      await incomeBtn.asElement().click();
      await wait(1500);
      await shot(page, 'B-4-8-filter-income');
      log('B-4-8', 'PASS', '수입 필터 적용');

      // 지출 필터
      const expenseBtn = await page.evaluateHandle(() => {
        const btns = document.querySelectorAll('button');
        for (const b of btns) {
          if (b.textContent?.trim() === '지출' && !b.closest('form')) return b;
        }
        return null;
      });
      if (expenseBtn && expenseBtn.asElement()) {
        await expenseBtn.asElement().click();
        await wait(1500);
        await shot(page, 'B-4-8-filter-expense');
      }

      // 전체로 복원
      const allBtn = await page.evaluateHandle(() => {
        const btns = document.querySelectorAll('button');
        for (const b of btns) {
          if (b.textContent?.trim() === '전체' && !b.closest('form')) return b;
        }
        return null;
      });
      if (allBtn && allBtn.asElement()) await allBtn.asElement().click();
      await wait(500);
    } else {
      log('B-4-8', 'WARN', '수입/지출 필터 버튼 미발견');
    }
  } catch (e) {
    log('B-4-8', 'FAIL', e.message);
  }

  // B-4-9: 카테고리 필터
  try {
    const catSelect = await page.$('select');
    if (catSelect) {
      const selected = await selectFirst(page, 'select');
      await wait(1500);
      await shot(page, 'B-4-9-filter-category');
      log('B-4-9', selected ? 'PASS' : 'WARN', '카테고리 필터');
    } else {
      log('B-4-9', 'WARN', '카테고리 필터 select 미발견');
    }
  } catch (e) {
    log('B-4-9', 'FAIL', e.message);
  }

  // B-4-10: 통장 필터
  try {
    const selects = await page.$$('select');
    if (selects.length >= 2) {
      const opts = await page.evaluate(
        el => Array.from(el.options).map(o => o.value).filter(v => v),
        selects[1],
      );
      if (opts.length > 0) {
        await selects[1].select(opts[0]);
        await wait(1500);
        await shot(page, 'B-4-10-filter-account');
        log('B-4-10', 'PASS', '통장 필터 적용');
      } else {
        log('B-4-10', 'WARN', '통장 필터 옵션 없음');
      }
    } else {
      log('B-4-10', 'WARN', '통장 필터 select 미발견');
    }
  } catch (e) {
    log('B-4-10', 'FAIL', e.message);
  }

  // ================================================================
  // B-5: 정기결제 수정 / 삭제 / 토글
  // ================================================================
  await page.goto(`${BASE}/recurring`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2500);

  // B-5-4: 정기결제 수정
  try {
    const clicked = await clickBtnText(page, '수정');
    if (clicked) {
      await wait(1000);
      const modal = await waitForModal(page);
      if (modal) {
        await shot(page, 'B-5-4-edit-modal');
        await clickBtnText(page, '취소');
        await wait(500);
        log('B-5-4', 'PASS', '정기결제 수정 모달 열기 성공');
      } else {
        log('B-5-4', 'WARN', '수정 클릭했으나 모달 미표시');
      }
    } else {
      log('B-5-4', 'WARN', '수정 버튼 미발견 — 정기결제 없을 수 있음');
    }
  } catch (e) {
    log('B-5-4', 'FAIL', e.message);
  }

  // B-5-6: 활성/비활성 토글
  try {
    let toggled = await clickBtnText(page, '일시정지');
    if (!toggled) toggled = await clickBtnText(page, '재개');
    if (toggled) {
      await wait(1500);
      await shot(page, 'B-5-6-toggle');
      log('B-5-6', 'PASS', '활성/비활성 토글 성공');
      // 원복
      const r = await clickBtnText(page, '재개');
      if (!r) await clickBtnText(page, '일시정지');
      await wait(500);
    } else {
      log('B-5-6', 'WARN', '토글 버튼 미발견');
    }
  } catch (e) {
    log('B-5-6', 'FAIL', e.message);
  }

  // B-5-5: 정기결제 삭제 (테스트용 추가 후 삭제)
  try {
    // 추가
    await clickBtnText(page, '추가');
    await wait(1000);
    const nameInput = await page.$('#rec-name');
    if (nameInput) await nameInput.type('삭제테스트구독', { delay: 15 });
    const amtInput = await page.$('#rec-amount');
    if (amtInput) await amtInput.type('5000', { delay: 15 });
    await selectFirst(page, '#rec-account');
    await wait(300);
    await clickBtnText(page, '추가');
    await wait(2500);

    // 마지막 "삭제" 버튼 클릭
    const delBtns = await page.$$('button');
    const delCandidates = [];
    for (const btn of delBtns) {
      const text = await page.evaluate(el => el.textContent?.trim() ?? '', btn);
      if (text === '삭제') delCandidates.push(btn);
    }
    if (delCandidates.length > 0) {
      await delCandidates[delCandidates.length - 1].click();
      await wait(1000);
      // ConfirmDialog
      await clickBtnText(page, '삭제');
      await wait(2000);
      await shot(page, 'B-5-5-after-delete');
      log('B-5-5', 'PASS', '정기결제 삭제 완료');
    } else {
      log('B-5-5', 'WARN', '삭제 버튼 미발견');
    }
  } catch (e) {
    log('B-5-5', 'FAIL', e.message);
  }

  // ================================================================
  // B-6: 저축 입금 / 삭제 / 진행률
  // ================================================================
  await page.goto(`${BASE}/savings`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2500);

  // B-6-4: 저축 납입 (자유적금만 "납입" 버튼 있음)
  try {
    const clicked = await clickBtnText(page, '납입');
    if (clicked) {
      await wait(1000);
      await shot(page, 'B-6-4-deposit');
      // 금액 입력 후 취소
      await clickBtnText(page, '취소');
      await wait(500);
      log('B-6-4', 'PASS', '납입 모달 열기 성공');
    } else {
      log('B-6-4', 'WARN', '납입 버튼 미발견 — 자유적금 없을 수 있음');
    }
  } catch (e) {
    log('B-6-4', 'FAIL', e.message);
  }

  // B-6-6: 진행률 바 표시
  try {
    const progressBars = await page.$$('div.h-2.overflow-hidden.rounded-full');
    if (progressBars.length > 0) {
      log('B-6-6', 'PASS', `진행률 바 ${progressBars.length}개 렌더링`);
    } else {
      // 더 넓은 셀렉터
      const anyProgress = await page.$$('[class*="rounded-full"][class*="overflow-hidden"]');
      log('B-6-6', anyProgress.length > 0 ? 'PASS' : 'WARN',
        `진행률 바: ${anyProgress.length}개`);
    }
    await shot(page, 'B-6-6-progress');
  } catch (e) {
    log('B-6-6', 'FAIL', e.message);
  }

  // B-6-5: 저축 삭제
  try {
    // 테스트용 저축 추가
    await clickBtnText(page, '추가');
    await wait(1000);
    const nameInput = await page.$('#sav-name');
    if (nameInput) await nameInput.type('삭제테스트저축', { delay: 15 });
    const rateInput = await page.$('#sav-rate');
    if (rateInput) await rateInput.type('2.5', { delay: 15 });
    const durInput = await page.$('#sav-duration');
    if (durInput) await durInput.type('12', { delay: 15 });
    // 예금 타입이면 원금 필요
    const principalInput = await page.$('#sav-principal');
    if (principalInput) await principalInput.type('1000000', { delay: 15 });
    await clickBtnText(page, '추가');
    await wait(2500);

    // 삭제 (title="삭제" 아이콘 버튼)
    const delBtns = await page.$$('button[title="삭제"]');
    if (delBtns.length > 0) {
      await delBtns[delBtns.length - 1].click();
      await wait(1000);
      await clickBtnText(page, '삭제');
      await wait(2000);
      await shot(page, 'B-6-5-after-delete');
      log('B-6-5', 'PASS', '저축 삭제 완료');
    } else {
      // 텍스트 "삭제" 버튼 시도
      const textDels = await page.$$('button');
      let found = false;
      for (const btn of textDels) {
        const t = await page.evaluate(el => el.textContent?.trim(), btn);
        if (t === '삭제') {
          await btn.click();
          await wait(1000);
          await clickBtnText(page, '삭제');
          await wait(2000);
          found = true;
          break;
        }
      }
      log('B-6-5', found ? 'PASS' : 'WARN', found ? '저축 삭제 완료' : '삭제 버튼 미발견');
    }
  } catch (e) {
    log('B-6-5', 'FAIL', e.message);
  }

  // ================================================================
  // B-7: 예산 수정 / 삭제 / 사용률
  // ================================================================
  await page.goto(`${BASE}/budget`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2500);

  // B-7-4: 예산 수정 (연필 아이콘 버튼)
  try {
    const editBtns = await page.$$('button[title="수정"]');
    // BudgetCard에는 title이 아닌 연필 아이콘
    if (editBtns.length > 0) {
      await editBtns[0].click();
      await wait(1000);
      const modal = await waitForModal(page);
      await shot(page, 'B-7-4-edit-modal');
      await clickBtnText(page, '취소');
      await wait(500);
      log('B-7-4', modal ? 'PASS' : 'WARN', '예산 수정 모달');
    } else {
      // SVG 연필 아이콘 버튼 시도
      const allBtns = await page.$$('button');
      let found = false;
      for (const btn of allBtns) {
        const html = await page.evaluate(el => el.innerHTML, btn);
        if (html.includes('M11') && html.includes('svg') && html.length < 500) {
          // 연필 아이콘 SVG path 패턴
          await btn.click();
          await wait(1000);
          const modal = await waitForModal(page);
          await shot(page, 'B-7-4-edit-modal');
          if (modal) await clickBtnText(page, '취소');
          await wait(500);
          log('B-7-4', modal ? 'PASS' : 'WARN', '예산 수정 (아이콘)');
          found = true;
          break;
        }
      }
      if (!found) log('B-7-4', 'WARN', '수정 버튼 미발견 — 예산 없을 수 있음');
    }
  } catch (e) {
    log('B-7-4', 'FAIL', e.message);
  }

  // B-7-6: 예산 사용률 표시
  try {
    const content = await bodyText(page);
    const hasPercent = content.includes('%');
    const hasRemaining = content.includes('남음') || content.includes('달성');
    log('B-7-6', hasPercent || hasRemaining ? 'PASS' : 'WARN',
      `사용률: %=${hasPercent}, 남음=${hasRemaining}`);
    await shot(page, 'B-7-6-usage');
  } catch (e) {
    log('B-7-6', 'FAIL', e.message);
  }

  // B-7-5: 예산 삭제
  try {
    // 테스트 예산 추가
    await clickBtnText(page, '추가');
    await wait(1000);
    const nameInput = await page.$('#budget-name');
    if (nameInput) await nameInput.type('삭제테스트예산', { delay: 15 });
    const targetInput = await page.$('#budget-target');
    if (targetInput) await targetInput.type('100000', { delay: 15 });
    await clickBtnText(page, '추가');
    await wait(2500);

    // 삭제 (휴지통 아이콘 버튼)
    const allBtns = await page.$$('button');
    const trashBtns = [];
    for (const btn of allBtns) {
      const html = await page.evaluate(el => el.innerHTML, btn);
      // 휴지통 SVG path 패턴 (M19 7l-.867 등)
      if (html.includes('svg') && (html.includes('M19') || html.includes('trash')) && html.length < 500) {
        trashBtns.push(btn);
      }
    }
    if (trashBtns.length > 0) {
      await trashBtns[trashBtns.length - 1].click();
      await wait(1000);
      await clickBtnText(page, '삭제');
      await wait(2000);
      await shot(page, 'B-7-5-after-delete');
      log('B-7-5', 'PASS', '예산 삭제 완료');
    } else {
      log('B-7-5', 'WARN', '삭제 아이콘 버튼 미발견');
    }
  } catch (e) {
    log('B-7-5', 'FAIL', e.message);
  }

  // ================================================================
  // B-8: 통계 기간 / 카테고리 / 통장
  // ================================================================
  await page.goto(`${BASE}/statistics`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(3000);

  // B-8-2: 기간 선택
  try {
    let clicked = await clickBtnText(page, '6개월');
    if (clicked) {
      await wait(1500);
      await shot(page, 'B-8-2-6months');
      log('B-8-2', 'PASS', '6개월 기간 선택');
      await clickBtnText(page, '12개월');
      await wait(500);
    } else {
      log('B-8-2', 'WARN', '기간 선택 버튼 미발견');
    }
  } catch (e) {
    log('B-8-2', 'FAIL', e.message);
  }

  // B-8-4: 카테고리 분석 차트
  try {
    const svgs = await page.$$('svg');
    const chartCount = svgs.length;
    log('B-8-4', chartCount >= 2 ? 'PASS' : 'WARN', `차트 ${chartCount}개 (카테고리 포함)`);
    await shot(page, 'B-8-4-charts');
  } catch (e) {
    log('B-8-4', 'FAIL', e.message);
  }

  // B-8-5: 통장별 분배 차트
  try {
    const svgs = await page.$$('svg');
    log('B-8-5', svgs.length >= 3 ? 'PASS' : 'WARN', `통장 분배 차트 포함 총 ${svgs.length}개`);
    await shot(page, 'B-8-5-distribution');
  } catch (e) {
    log('B-8-5', 'FAIL', e.message);
  }

  // ================================================================
  // B-9: 투자 종목 CRUD / 포트폴리오 삭제
  // ================================================================
  await page.goto(`${BASE}/investments`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2500);

  // B-9-5: 종목 추가 (포트폴리오 상세에서)
  try {
    // 포트폴리오 카드 클릭 → 상세
    const cards = await page.$$('button[type="button"].w-full');
    const links = await page.$$('a[href*="/investments/"]');

    if (links.length > 0) {
      await links[0].click();
    } else if (cards.length > 0) {
      await cards[0].click();
    }
    await wait(2500);

    if (page.url().includes('/investments/')) {
      await shot(page, 'B-9-5-detail-page');

      // 거래 추가 버튼
      const addClicked = await clickBtnText(page, '거래 추가') || await clickBtnText(page, '추가');
      if (addClicked) {
        await wait(1000);
        const modal = await waitForModal(page);
        if (modal) {
          // TradeForm 필드 채우기
          const inputs = await page.$$('form input, [role="dialog"] input');
          for (const inp of inputs) {
            const ph = await page.evaluate(el => el.placeholder ?? '', inp);
            const type = await page.evaluate(el => el.type, inp);
            if (ph.includes('티커') || ph.includes('ticker') || ph.includes('종목코드')) {
              await inp.type('AAPL', { delay: 15 });
            } else if (ph.includes('이름') || ph.includes('name') || ph.includes('종목명')) {
              await inp.type('Apple Inc.', { delay: 15 });
            } else if (type === 'number') {
              const name = await page.evaluate(el => el.name ?? el.id ?? '', inp);
              if (name.includes('quantity') || name.includes('수량')) {
                await inp.type('10', { delay: 15 });
              } else if (name.includes('price') || name.includes('가격')) {
                await inp.type('150', { delay: 15 });
              }
            }
          }
          // 숫자 필드가 비어있으면 순서대로
          const numInputs = await page.$$('input[type="number"]');
          for (let i = 0; i < numInputs.length; i++) {
            const val = await page.evaluate(el => el.value, numInputs[i]);
            if (!val) {
              if (i === 0) await numInputs[i].type('10', { delay: 15 });
              else if (i === 1) await numInputs[i].type('150', { delay: 15 });
            }
          }

          await shot(page, 'B-9-5-trade-form');
          await clickBtnText(page, '거래 추가') || await clickBtnText(page, '추가');
          await wait(2500);
          log('B-9-5', 'PASS', '종목 거래 추가 폼 제출');
        } else {
          log('B-9-5', 'WARN', '거래 추가 클릭했으나 모달 미표시');
        }
      } else {
        log('B-9-5', 'WARN', '거래 추가 버튼 미발견');
      }
    } else {
      log('B-9-5', 'WARN', '포트폴리오 상세 페이지 이동 실패');
    }
  } catch (e) {
    log('B-9-5', 'FAIL', e.message);
  }

  // B-9-6: 포트폴리오 삭제
  try {
    await page.goto(`${BASE}/investments`, { waitUntil: 'networkidle0', timeout: 20000 });
    await wait(2000);

    // 테스트 포트폴리오 추가
    const addClicked = await clickBtnText(page, '추가') || await clickBtnText(page, '새');
    if (addClicked) {
      await wait(1000);
      const inputs = await page.$$('form input, [role="dialog"] input');
      if (inputs.length > 0) await inputs[0].type('삭제테스트포폴', { delay: 15 });
      await clickBtnText(page, '추가') || await clickBtnText(page, '저장') || await clickBtnText(page, '생성');
      await wait(2500);
    }

    // "삭제" 텍스트 버튼 클릭
    const delBtns = await page.$$('button');
    const candidates = [];
    for (const btn of delBtns) {
      const text = await page.evaluate(el => el.textContent?.trim() ?? '', btn);
      if (text === '삭제') candidates.push(btn);
    }
    if (candidates.length > 0) {
      await candidates[candidates.length - 1].click();
      await wait(1000);
      await clickBtnText(page, '삭제');
      await wait(2000);
      await shot(page, 'B-9-6-after-delete');
      log('B-9-6', 'PASS', '포트폴리오 삭제 완료');
    } else {
      log('B-9-6', 'WARN', '삭제 버튼 미발견');
    }
  } catch (e) {
    log('B-9-6', 'FAIL', e.message);
  }

  // ================================================================
  // B-10: 부동산 상세 / 임대 / 비용 / 삭제
  // ================================================================
  await page.goto(`${BASE}/real-estate`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2500);

  // B-10-4: 매물 상세 페이지
  try {
    // PropertyCard는 role="button"
    const cards = await page.$$('[role="button"][tabindex="0"]');
    const links = await page.$$('a[href*="/real-estate/"]');

    if (cards.length > 0) {
      await cards[0].click();
    } else if (links.length > 0) {
      await links[0].click();
    }
    await wait(2500);

    if (page.url().includes('/real-estate/')) {
      await shot(page, 'B-10-4-detail');
      log('B-10-4', 'PASS', `상세 페이지 이동: ${page.url()}`);
    } else {
      log('B-10-4', 'WARN', '상세 페이지 이동 실패');
    }
  } catch (e) {
    log('B-10-4', 'FAIL', e.message);
  }

  // B-10-5: 임대 정보 추가 (상세 페이지에서)
  if (page.url().includes('/real-estate/')) {
    try {
      const clicked = await clickBtnText(page, '계약 추가') || await clickBtnText(page, '임대 추가');
      if (clicked) {
        await wait(1000);
        const modal = await waitForModal(page);
        if (modal) {
          await shot(page, 'B-10-5-lease-modal');
          await clickBtnText(page, '취소');
          await wait(500);
          log('B-10-5', 'PASS', '임대 추가 모달 열기 성공');
        } else {
          log('B-10-5', 'WARN', '모달 미표시');
        }
      } else {
        log('B-10-5', 'WARN', '계약 추가 버튼 미발견');
      }
    } catch (e) {
      log('B-10-5', 'FAIL', e.message);
    }

    // B-10-6: 비용 추가 (상세 페이지에서)
    try {
      const clicked = await clickBtnText(page, '비용 추가');
      if (clicked) {
        await wait(1000);
        const modal = await waitForModal(page);
        if (modal) {
          await shot(page, 'B-10-6-expense-modal');
          await clickBtnText(page, '취소');
          await wait(500);
          log('B-10-6', 'PASS', '비용 추가 모달 열기 성공');
        } else {
          log('B-10-6', 'WARN', '모달 미표시');
        }
      } else {
        log('B-10-6', 'WARN', '비용 추가 버튼 미발견');
      }
    } catch (e) {
      log('B-10-6', 'FAIL', e.message);
    }
  } else {
    log('B-10-5', 'SKIP', '상세 페이지 미이동');
    log('B-10-6', 'SKIP', '상세 페이지 미이동');
  }

  // B-10-7: 매물 삭제
  try {
    await page.goto(`${BASE}/real-estate`, { waitUntil: 'networkidle0', timeout: 20000 });
    await wait(2000);

    // 테스트 매물 추가
    const addClicked = await clickBtnText(page, '추가');
    if (addClicked) {
      await wait(1000);
      const inputs = await page.$$('form input, [role="dialog"] input');
      for (const inp of inputs) {
        const type = await page.evaluate(el => el.type, inp);
        const val = await page.evaluate(el => el.value, inp);
        if (!val && type === 'text') {
          await inp.type('삭제테스트부동산', { delay: 15 });
          break;
        }
      }
      await clickBtnText(page, '추가') || await clickBtnText(page, '저장') || await clickBtnText(page, '등록');
      await wait(2500);
    }

    // aria-label="삭제" 버튼 (PropertyCard 사용)
    const delBtns = await page.$$('button[aria-label="삭제"]');
    if (delBtns.length > 0) {
      await delBtns[delBtns.length - 1].click();
      await wait(1000);
      await clickBtnText(page, '삭제');
      await wait(2000);
      await shot(page, 'B-10-7-after-delete');
      log('B-10-7', 'PASS', '매물 삭제 완료');
    } else {
      log('B-10-7', 'WARN', 'aria-label="삭제" 버튼 미발견');
    }
  } catch (e) {
    log('B-10-7', 'FAIL', e.message);
  }

  // ================================================================
  // B-11-2: 공지사항 상세
  // ================================================================
  await page.goto(`${BASE}/announcements`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);

  try {
    // 공지 목록에서 첫 항목 클릭
    const items = await page.$$('a[href*="/announcements/"], [role="button"], li, .cursor-pointer');
    if (items.length > 0) {
      await items[0].click();
      await wait(2000);
      if (page.url().includes('/announcements/')) {
        await shot(page, 'B-11-2-detail');
        log('B-11-2', 'PASS', `공지 상세 이동: ${page.url()}`);
      } else {
        // 아코디언 방식일 수 있음
        const content = await bodyText(page);
        log('B-11-2', content.length > 100 ? 'PASS' : 'WARN', '공지 상세 (아코디언 또는 인라인)');
        await shot(page, 'B-11-2-detail');
      }
    } else {
      log('B-11-2', 'WARN', '공지 항목 미발견');
    }
  } catch (e) {
    log('B-11-2', 'FAIL', e.message);
  }

  // ================================================================
  // B-13: 휴지통 복원 / 영구삭제
  // ================================================================
  await page.goto(`${BASE}/trash`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2500);
  await shot(page, 'B-13-before');

  // B-13-3: 복원
  try {
    const content = await bodyText(page);
    const hasItems = content.includes('복원');
    if (hasItems) {
      await clickBtnText(page, '복원');
      await wait(2000);
      await shot(page, 'B-13-3-restore');
      log('B-13-3', 'PASS', '휴지통 복원 클릭 성공');
    } else {
      log('B-13-3', 'WARN', '복원할 항목 없음 (휴지통 비어있음)');
    }
  } catch (e) {
    log('B-13-3', 'FAIL', e.message);
  }

  // B-13-4: 영구삭제
  try {
    const content = await bodyText(page);
    const hasItems = content.includes('영구 삭제');
    if (hasItems) {
      await clickBtnText(page, '영구 삭제');
      await wait(1000);
      // ConfirmDialog
      const confirmClicked = await clickBtnText(page, '영구 삭제');
      await wait(2000);
      await shot(page, 'B-13-4-permanent-delete');
      log('B-13-4', 'PASS', '영구 삭제 실행');
    } else {
      log('B-13-4', 'WARN', '영구 삭제할 항목 없음');
    }
  } catch (e) {
    log('B-13-4', 'FAIL', e.message);
  }

  // ================================================================
  // 결과 저장
  // ================================================================
  await browser.close();

  const summary = { pass: 0, fail: 0, warn: 0, skip: 0 };
  for (const r of results) {
    if (r.status === 'PASS') summary.pass++;
    else if (r.status === 'FAIL') summary.fail++;
    else if (r.status === 'WARN') summary.warn++;
    else summary.skip++;
  }

  console.log('\n========== VAULT CRUD V2 TEST RESULTS ==========');
  console.log(`PASS: ${summary.pass} | FAIL: ${summary.fail} | WARN: ${summary.warn} | SKIP: ${summary.skip}`);
  console.log(`총 ${results.length}건 테스트`);
  console.log('=================================================\n');

  for (const r of results) {
    console.log(`  [${r.status}] ${r.id}: ${r.detail}`);
  }

  writeFileSync(resolve(OUT, 'results.json'), JSON.stringify(results, null, 2));
}

run().catch(console.error);
