/**
 * @file optimize-icons.mjs
 * @description icon.svg, logo.svg 내장 PNG를 최적화하여 파일 크기 축소
 *
 * 사용법: node scripts/optimize-icons.mjs
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');

/**
 * SVG 내부의 base64 PNG 이미지를 리사이즈하여 최적화
 */
async function optimizeSvgWithEmbeddedPng(filename, maxWidth, maxHeight) {
  const filepath = resolve(PUBLIC, filename);
  const svg = readFileSync(filepath, 'utf-8');

  /* base64 PNG 데이터 추출 */
  const match = svg.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
  if (!match) {
    console.log(`  [skip] ${filename}: no embedded PNG found`);
    return;
  }

  const originalB64 = match[1];
  const originalBuf = Buffer.from(originalB64, 'base64');
  const originalSize = originalBuf.length;

  /* 리사이즈 + PNG 최적화 */
  const optimized = await sharp(originalBuf)
    .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 80 })
    .toBuffer();

  const newB64 = optimized.toString('base64');

  /* SVG 내 base64 교체 + viewBox/width/height 업데이트 */
  const meta = await sharp(optimized).metadata();
  let newSvg = svg.replace(originalB64, newB64);

  /* width/height 속성 업데이트 */
  newSvg = newSvg.replace(/width="\d+"/, `width="${meta.width}"`);
  newSvg = newSvg.replace(/height="\d+"/, `height="${meta.height}"`);
  newSvg = newSvg.replace(/viewBox="0 0 \d+ \d+"/, `viewBox="0 0 ${meta.width} ${meta.height}"`);

  /* 내장 image 태그의 width/height도 업데이트 */
  newSvg = newSvg.replace(
    /(<image[^>]*?)width="\d+"(\s+)height="\d+"/,
    `$1width="${meta.width}"$2height="${meta.height}"`
  );

  writeFileSync(filepath, newSvg);

  const savedKB = ((svg.length - newSvg.length) / 1024).toFixed(1);
  console.log(`  ${filename}: ${(svg.length / 1024).toFixed(1)}KB -> ${(newSvg.length / 1024).toFixed(1)}KB (-${savedKB}KB)`);
}

async function main() {
  console.log('Optimizing SVG icons...');

  /* icon.svg: 원본 558x548 → 256x256 (실제 사용: 사이드바/헤더에서 최대 ~48px) */
  await optimizeSvgWithEmbeddedPng('icon.svg', 256, 256);

  /* logo.svg: 원본 731x226 → 400x124 (실제 사용: 로그인/사이드바에서 최대 ~200px) */
  await optimizeSvgWithEmbeddedPng('logo.svg', 400, 124);

  /* icon-192.png 최적화 */
  const icon192Path = resolve(PUBLIC, 'icon-192.png');
  const original192 = readFileSync(icon192Path);
  const optimized192 = await sharp(icon192Path)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 80 })
    .toBuffer();

  writeFileSync(icon192Path, optimized192);
  console.log(`  icon-192.png: ${(original192.length / 1024).toFixed(1)}KB -> ${(optimized192.length / 1024).toFixed(1)}KB`);

  console.log('Done!');
}

main().catch(console.error);
