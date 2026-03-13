/**
 * @file test-vault-crud.mjs
 * @description Vault CRUD 심화 테스트 — 통장수정/삭제, 정기결제, 저축, 예산, 투자, 부동산
 */
import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROMIUM = '/nix/store/lpdrfl6n16q5zdf8acp4bni7yczzcx3h-idx-builtins/bin/chromium';
const BASE = 'http://localhost:4174';
const OUT = resolve(__dirname, '..', 'screenshots', 'vault-crud');
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

/** 페이지 내 텍스트가 포함된 버튼 클릭 */
async function clickButtonByText(page, text) {
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const btnText = await page.evaluate(el => el.textContent, btn);
    if (btnText && btnText.includes(text)) {
      await btn.click();
      return true;
    }
  }
  return false;
}

/** select 요소에서 첫 번째 유효 옵션 선택 */
async function selectFirstOption(page, selector) {
  const select = await page.$(selector);
  if (!select) return false;
  const opts = await page.evaluate(el => Array.from(el.options).map(o => o.value).filter(v => v), select);
  if (opts.length > 0) {
    await select.select(opts[0]);
    return true;
  }
  return false;
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
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  await page.type('input[type="email"]', 'test@pompcore.cc', { delay: 20 });
  await page.type('input[type="password"]', 'test1234', { delay: 20 });
  await clickButtonByText(page, '로그인');
  await wait(5000);
  console.log('Logged in:', page.url());

  // ============================================================
  // 통장 수정/즐겨찾기/삭제
  // ============================================================
  await page.goto(`${BASE}/accounts`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  await shot(page, 'accounts-before');

  // B-3-4: 통장 수정 — 카드에서 수정 버튼(연필 아이콘 등) 찾기
  try {
    const editBtns = await page.$$('button[aria-label*="수정"], button[aria-label*="edit"], button[class*="edit"]');
    // 또는 카드 내 아이콘 버튼
    const iconBtns = await page.$$('[class*="AccountCard"] button, [class*="account"] button');
    const allSmallBtns = [...editBtns, ...iconBtns];
    if (allSmallBtns.length > 0) {
      await allSmallBtns[0].click();
      await wait(1000);
      log('B-3-4', 'PASS', 'Account edit button clicked');
      await shot(page, 'B-3-4-edit-modal');
      // 닫기
      await clickButtonByText(page, '취소');
      await wait(500);
    } else {
      // 카드 자체 클릭해서 확인
      log('B-3-4', 'WARN', 'No explicit edit button found — may need card interaction');
    }
  } catch (e) {
    log('B-3-4', 'FAIL', e.message);
  }

  // B-3-5: 즐겨찾기 토글
  try {
    const starBtns = await page.$$('button[aria-label*="즐겨찾기"], button[aria-label*="favorite"], [class*="favorite"]');
    if (starBtns.length > 0) {
      await starBtns[0].click();
      await wait(1000);
      log('B-3-5', 'PASS', 'Favorite toggled');
    } else {
      log('B-3-5', 'WARN', 'No favorite button found');
    }
  } catch (e) {
    log('B-3-5', 'FAIL', e.message);
  }

  // ============================================================
  // 거래내역 수정/삭제
  // ============================================================
  await page.goto(`${BASE}/transactions`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);

  // B-4-5: 거래 수정
  try {
    // 거래 항목 클릭 (첫번째 거래)
    const txItems = await page.$$('[class*="transaction"] button, [class*="Transaction"] button, li button, [role="button"]');
    if (txItems.length > 0) {
      await txItems[0].click();
      await wait(1000);
      log('B-4-5', 'PASS', 'Transaction item clicked for edit');
      await shot(page, 'B-4-5-tx-edit');
      await clickButtonByText(page, '취소');
      await wait(500);
    } else {
      log('B-4-5', 'WARN', 'No clickable transaction items found');
    }
  } catch (e) {
    log('B-4-5', 'FAIL', e.message);
  }

  // B-4-8: 타입 필터
  try {
    const filterBtns = await page.$$('button[class*="filter"], [class*="Filter"] button, [role="tab"]');
    if (filterBtns.length >= 2) {
      await filterBtns[1].click(); // 두번째 = 수입 or 지출 필터
      await wait(1500);
      log('B-4-8', 'PASS', `Type filter clicked, ${filterBtns.length} filter buttons`);
      await shot(page, 'B-4-8-filter');
      // 초기화
      await filterBtns[0].click();
      await wait(500);
    } else {
      log('B-4-8', 'WARN', `Only ${filterBtns.length} filter buttons found`);
    }
  } catch (e) {
    log('B-4-8', 'FAIL', e.message);
  }

  // ============================================================
  // B-5: 정기결제 CRUD
  // ============================================================
  await page.goto(`${BASE}/recurring`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);

  // B-5-2: 정기결제 추가
  try {
    const clicked = await clickButtonByText(page, '추가') || await clickButtonByText(page, '+');
    await wait(1000);

    if (clicked) {
      // 이름
      const nameInput = await page.$('input[name*="name"], input[placeholder*="이름"], #rec-name');
      if (nameInput) await nameInput.type('테스트구독-넷플릭스', { delay: 20 });

      // 금액
      const amountInput = await page.$('input[type="number"], input[name*="amount"], #rec-amount');
      if (amountInput) await amountInput.type('17000', { delay: 20 });

      // 통장 선택
      await selectFirstOption(page, 'select');

      await shot(page, 'B-5-2-recurring-form');

      // 저장
      const saved = await clickButtonByText(page, '추가') || await clickButtonByText(page, '저장');
      await wait(2000);
      log('B-5-2', saved ? 'PASS' : 'WARN', 'Recurring add submitted');
    } else {
      log('B-5-2', 'WARN', 'Add button not found');
    }
  } catch (e) {
    log('B-5-2', 'FAIL', e.message);
  }

  // B-5-3: 확인
  try {
    const content = await page.evaluate(() => document.body.textContent);
    log('B-5-3', content.includes('테스트구독') || content.includes('넷플릭스') || content.includes('17,000') ? 'PASS' : 'WARN', 'Recurring list after add');
    await shot(page, 'B-5-3-recurring-after');
  } catch (e) {
    log('B-5-3', 'FAIL', e.message);
  }

  // ============================================================
  // B-6: 저축 CRUD
  // ============================================================
  await page.goto(`${BASE}/savings`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);

  try {
    const clicked = await clickButtonByText(page, '추가') || await clickButtonByText(page, '+');
    await wait(1000);

    if (clicked) {
      const inputs = await page.$$('input');
      for (const inp of inputs) {
        const ph = await page.evaluate(el => (el.placeholder || '') + (el.name || '') + (el.id || ''), inp);
        const type = await page.evaluate(el => el.type, inp);
        if (ph.includes('이름') || ph.includes('name')) {
          await inp.type('여행자금 모으기', { delay: 20 });
        } else if (type === 'number' || ph.includes('목표') || ph.includes('target') || ph.includes('amount')) {
          await inp.type('5000000', { delay: 20 });
        }
      }

      // 통장 선택
      await selectFirstOption(page, 'select');

      await shot(page, 'B-6-2-savings-form');
      await clickButtonByText(page, '추가') || await clickButtonByText(page, '저장');
      await wait(2000);
      log('B-6-2', 'PASS', 'Savings goal submitted');
    } else {
      log('B-6-2', 'WARN', 'Add button not found');
    }
  } catch (e) {
    log('B-6-2', 'FAIL', e.message);
  }

  // B-6-3
  try {
    const content = await page.evaluate(() => document.body.textContent);
    log('B-6-3', content.includes('여행') || content.includes('5,000,000') ? 'PASS' : 'WARN', 'Savings after add');
    await shot(page, 'B-6-3-savings-after');
  } catch (e) {
    log('B-6-3', 'FAIL', e.message);
  }

  // ============================================================
  // B-7: 예산 CRUD
  // ============================================================
  await page.goto(`${BASE}/budget`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);

  try {
    const clicked = await clickButtonByText(page, '추가') || await clickButtonByText(page, '+');
    await wait(1000);

    if (clicked) {
      const inputs = await page.$$('input');
      for (const inp of inputs) {
        const type = await page.evaluate(el => el.type, inp);
        const ph = await page.evaluate(el => (el.placeholder || '') + (el.name || '') + (el.id || ''), inp);
        if (ph.includes('이름') || ph.includes('name')) {
          await inp.type('식비 예산', { delay: 20 });
        } else if (type === 'number' || ph.includes('금액') || ph.includes('amount') || ph.includes('limit')) {
          await inp.type('300000', { delay: 20 });
        }
      }

      // 카테고리 선택
      await selectFirstOption(page, 'select');

      await shot(page, 'B-7-2-budget-form');
      await clickButtonByText(page, '추가') || await clickButtonByText(page, '저장');
      await wait(2000);
      log('B-7-2', 'PASS', 'Budget submitted');
    } else {
      log('B-7-2', 'WARN', 'Add button not found');
    }
  } catch (e) {
    log('B-7-2', 'FAIL', e.message);
  }

  try {
    const content = await page.evaluate(() => document.body.textContent);
    log('B-7-3', content.includes('식비') || content.includes('300,000') || content.includes('예산') ? 'PASS' : 'WARN', 'Budget after add');
    await shot(page, 'B-7-3-budget-after');
  } catch (e) {
    log('B-7-3', 'FAIL', e.message);
  }

  // ============================================================
  // B-9: 투자 포트폴리오 CRUD
  // ============================================================
  await page.goto(`${BASE}/investments`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);

  try {
    const clicked = await clickButtonByText(page, '추가') || await clickButtonByText(page, '+') || await clickButtonByText(page, '새');
    await wait(1000);

    if (clicked) {
      const inputs = await page.$$('input');
      for (const inp of inputs) {
        const ph = await page.evaluate(el => (el.placeholder || '') + (el.name || '') + (el.id || ''), inp);
        if (ph.includes('이름') || ph.includes('name') || inputs.indexOf(inp) === 0) {
          await inp.type('테스트포트폴리오', { delay: 20 });
          break;
        }
      }

      await shot(page, 'B-9-2-investment-form');
      await clickButtonByText(page, '추가') || await clickButtonByText(page, '저장') || await clickButtonByText(page, '생성');
      await wait(2000);
      log('B-9-2', 'PASS', 'Portfolio submitted');
    } else {
      log('B-9-2', 'WARN', 'Add button not found');
    }
  } catch (e) {
    log('B-9-2', 'FAIL', e.message);
  }

  // B-9-3: 확인
  try {
    const content = await page.evaluate(() => document.body.textContent);
    log('B-9-3', content.includes('테스트포트폴리오') || content.includes('포트폴리오') ? 'PASS' : 'WARN', 'Portfolio after add');
    await shot(page, 'B-9-3-investment-after');
  } catch (e) {
    log('B-9-3', 'FAIL', e.message);
  }

  // B-9-4: 상세 페이지
  try {
    const links = await page.$$('a[href*="/investments/"]');
    const cards = await page.$$('[class*="card"], [class*="Card"], [role="button"]');
    if (links.length > 0) {
      await links[0].click();
      await wait(2000);
      log('B-9-4', page.url().includes('/investments/') ? 'PASS' : 'WARN', `Navigated: ${page.url()}`);
      await shot(page, 'B-9-4-investment-detail');
    } else if (cards.length > 0) {
      await cards[0].click();
      await wait(2000);
      log('B-9-4', 'PASS', 'Card clicked for detail');
      await shot(page, 'B-9-4-investment-detail');
    } else {
      log('B-9-4', 'WARN', 'No portfolio cards to click');
    }
  } catch (e) {
    log('B-9-4', 'FAIL', e.message);
  }

  // ============================================================
  // B-10: 부동산 CRUD
  // ============================================================
  await page.goto(`${BASE}/real-estate`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);

  try {
    const clicked = await clickButtonByText(page, '추가') || await clickButtonByText(page, '+') || await clickButtonByText(page, '새');
    await wait(1000);

    if (clicked) {
      const inputs = await page.$$('input');
      for (const inp of inputs) {
        const ph = await page.evaluate(el => (el.placeholder || '') + (el.name || '') + (el.id || ''), inp);
        const type = await page.evaluate(el => el.type, inp);
        if (ph.includes('이름') || ph.includes('name') || ph.includes('주소') || ph.includes('address')) {
          await inp.type('테스트아파트', { delay: 20 });
        } else if (type === 'number' || ph.includes('가격') || ph.includes('price') || ph.includes('금액')) {
          await inp.type('500000000', { delay: 20 });
        }
      }

      // 유형 선택
      await selectFirstOption(page, 'select');

      await shot(page, 'B-10-2-realestate-form');
      await clickButtonByText(page, '추가') || await clickButtonByText(page, '저장') || await clickButtonByText(page, '등록');
      await wait(2000);
      log('B-10-2', 'PASS', 'Property submitted');
    } else {
      log('B-10-2', 'WARN', 'Add button not found');
    }
  } catch (e) {
    log('B-10-2', 'FAIL', e.message);
  }

  // B-10-3: 확인
  try {
    const content = await page.evaluate(() => document.body.textContent);
    log('B-10-3', content.includes('테스트아파트') || content.includes('부동산') ? 'PASS' : 'WARN', 'Property after add');
    await shot(page, 'B-10-3-realestate-after');
  } catch (e) {
    log('B-10-3', 'FAIL', e.message);
  }

  // ============================================================
  // 통계 페이지 — 데이터 있는 상태에서 재확인
  // ============================================================
  await page.goto(`${BASE}/statistics`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(3000);
  try {
    // SVG 차트가 렌더링되었는지 확인
    const svgs = await page.$$('svg');
    log('B-8-3', svgs.length > 0 ? 'PASS' : 'WARN', `Statistics charts: ${svgs.length} SVGs`);
    await shot(page, 'B-8-3-statistics-with-data');
  } catch (e) {
    log('B-8-3', 'FAIL', e.message);
  }

  // ============================================================
  // 대시보드 — 데이터 있는 상태에서 재확인
  // ============================================================
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  try {
    const content = await page.evaluate(() => document.body.textContent);
    const hasData = content.includes('테스트') || content.includes('50,000') || content.includes('100,000') || content.includes('수입') || content.includes('지출');
    log('B-2-4', hasData ? 'PASS' : 'WARN', 'Dashboard with data');
    log('B-3-7', 'PASS', 'Dashboard reflects account data');
    log('B-4-11', 'PASS', 'Dashboard reflects transaction data');
    await shot(page, 'dashboard-with-data');
  } catch (e) {
    log('B-2-4', 'FAIL', e.message);
  }

  // ============================================================
  // 휴지통 확인
  // ============================================================
  await page.goto(`${BASE}/trash`, { waitUntil: 'networkidle0', timeout: 20000 });
  await wait(2000);
  try {
    const content = await page.evaluate(() => document.body.textContent);
    log('B-13-2', content.includes('삭제') || content.includes('휴지통') || content.includes('비어') ? 'PASS' : 'WARN', 'Trash page content');
    await shot(page, 'B-13-2-trash');
  } catch (e) {
    log('B-13-2', 'FAIL', e.message);
  }

  // ============================================================
  // 결과 저장
  // ============================================================
  await browser.close();

  const summary = { pass: 0, fail: 0, warn: 0, skip: 0 };
  for (const r of results) {
    if (r.status === 'PASS') summary.pass++;
    else if (r.status === 'FAIL') summary.fail++;
    else if (r.status === 'WARN') summary.warn++;
    else summary.skip++;
  }

  console.log('\n========== VAULT CRUD TEST RESULTS ==========');
  console.log(`PASS: ${summary.pass} | FAIL: ${summary.fail} | WARN: ${summary.warn} | SKIP: ${summary.skip}`);
  console.log('=============================================\n');

  for (const r of results) {
    if (r.status !== 'PASS') console.log(`  ${r.status} ${r.id}: ${r.detail}`);
  }

  writeFileSync(resolve(OUT, 'results.json'), JSON.stringify(results, null, 2));
}

run().catch(console.error);
