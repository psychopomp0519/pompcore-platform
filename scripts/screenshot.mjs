/**
 * @file screenshot.mjs
 * @description Puppeteer 기반 페이지 스크린샷 캡처 스크립트
 * @usage node scripts/screenshot.mjs [url] [filename] [width] [height]
 *        PORT=4174 node scripts/screenshot.mjs /login vault-login  → Vault 앱 캡처
 */

import puppeteer from 'puppeteer-core';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHROMIUM_PATH = '/nix/store/lpdrfl6n16q5zdf8acp4bni7yczzcx3h-idx-builtins/bin/chromium';
const PORT = process.env.PORT || '4173';
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = resolve(__dirname, '..', 'screenshots');

const urlPath = process.argv[2] || '/';
const fileName = process.argv[3] || 'page';
const viewportWidth = parseInt(process.argv[4] || '1280', 10);
const viewportHeight = parseInt(process.argv[5] || '800', 10);

mkdirSync(OUTPUT_DIR, { recursive: true });

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  // CDP Fetch 도메인으로 CSS 응답을 가로채서 font-display: swap 강제 주입
  const client = await page.createCDPSession();
  await client.send('Fetch.enable', {
    patterns: [
      { urlPattern: '*', resourceType: 'Stylesheet' },
      { urlPattern: '*.css', resourceType: 'Stylesheet' },
    ],
  });

  client.on('Fetch.requestPaused', async (event) => {
    const { requestId } = event;
    try {
      const response = await client.send('Fetch.getResponseBody', { requestId });
      let body = response.base64Encoded
        ? Buffer.from(response.body, 'base64').toString('utf-8')
        : response.body;

      // 모든 @font-face 블록에 font-display: swap 강제 삽입
      body = body.replace(/@font-face\s*\{/g, '@font-face{font-display:swap!important;');
      // 기존 font-display 선언도 swap으로 교체
      body = body.replace(/font-display\s*:\s*[^;]+;/g, 'font-display:swap!important;');

      await client.send('Fetch.fulfillRequest', {
        requestId,
        responseCode: event.responseStatusCode || 200,
        responseHeaders: event.responseHeaders || [],
        body: Buffer.from(body, 'utf-8').toString('base64'),
      });
    } catch {
      // 응답 본문을 못 가져올 경우 (리다이렉트 등) 원본 그대로 전달
      try {
        await client.send('Fetch.continueRequest', { requestId });
      } catch {
        // 이미 처리됨
      }
    }
  });

  const fullUrl = `${BASE_URL}${urlPath}`;
  console.log(`Navigating to: ${fullUrl} (${viewportWidth}x${viewportHeight})`);

  await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 20000 });

  // 렌더링 안정화 대기
  await new Promise((r) => setTimeout(r, 1500));

  const outPath = resolve(OUTPUT_DIR, `${fileName}.png`);
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Screenshot saved: ${outPath}`);

  await browser.close();
}

capture().catch((err) => {
  console.error('Screenshot failed:', err.message);
  process.exit(1);
});
