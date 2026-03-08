/**
 * @file generate-favicon.mjs
 * @description icon.svg에서 배경 + 여백이 추가된 파비콘 생성 스크립트
 *
 * 사용법: node scripts/generate-favicon.mjs
 *
 * 출력 파일:
 *   public/favicon-bg-32.png   (32x32)
 *   public/favicon-bg-180.png  (180x180, Apple Touch Icon)
 *   public/favicon-bg.ico      (16x16 + 32x32 + 48x48)
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');

/** 브랜드 컬러 */
const BG_COLOR = '#10B981';

/** 아이콘 여백 비율 (전체 대비 아이콘이 차지하는 비율) */
const ICON_RATIO = 0.65;

/** 배경 모서리 둥글기 비율 (캔버스 대비) */
const CORNER_RATIO = 0.22;

/**
 * 라운드 사각형 배경 위에 아이콘을 배치한 PNG 생성
 */
async function generateFaviconWithBg(size) {
  const iconSize = Math.round(size * ICON_RATIO);
  const padding = Math.round((size - iconSize) / 2);
  const cornerRadius = Math.round(size * CORNER_RATIO);

  /* 라운드 사각형 배경 SVG */
  const bgSvg = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${BG_COLOR}" />
    </svg>
  `);

  /* 원본 아이콘을 리사이즈 */
  const iconPng = await sharp(resolve(PUBLIC, 'icon.svg'), { density: 300 })
    .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  /* 배경 위에 아이콘 합성 */
  const result = await sharp(bgSvg)
    .resize(size, size)
    .composite([{ input: iconPng, left: padding, top: padding }])
    .png()
    .toBuffer();

  return result;
}

/**
 * ICO 파일 생성 (16, 32, 48px PNG를 ICO 컨테이너에 패킹)
 */
function createIco(pngBuffers) {
  const count = pngBuffers.length;

  /* ICO 헤더 (6 bytes) */
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // ICO type
  header.writeUInt16LE(count, 4);  // image count

  /* 디렉토리 엔트리 (16 bytes each) */
  const dirSize = 16 * count;
  let dataOffset = 6 + dirSize;
  const entries = [];

  for (const png of pngBuffers) {
    const size = Math.round(Math.sqrt(png.length / 4)); // approximate
    const entry = Buffer.alloc(16);

    /* sharp PNG에서 실제 크기 읽기 */
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);

    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2);               // color palette
    entry.writeUInt8(0, 3);               // reserved
    entry.writeUInt16LE(1, 4);            // color planes
    entry.writeUInt16LE(32, 6);           // bits per pixel
    entry.writeUInt32LE(png.length, 8);   // data size
    entry.writeUInt32LE(dataOffset, 12);  // data offset

    entries.push(entry);
    dataOffset += png.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  console.log('Generating favicons with background...');

  /* 각 크기 생성 */
  const [png16, png32, png48, png180] = await Promise.all([
    generateFaviconWithBg(16),
    generateFaviconWithBg(32),
    generateFaviconWithBg(48),
    generateFaviconWithBg(180),
  ]);

  /* PNG 파일 저장 */
  writeFileSync(resolve(PUBLIC, 'favicon-bg-32.png'), png32);
  writeFileSync(resolve(PUBLIC, 'favicon-bg-180.png'), png180);
  console.log('  -> favicon-bg-32.png (32x32)');
  console.log('  -> favicon-bg-180.png (180x180)');

  /* ICO 파일 생성 */
  const ico = createIco([png16, png32, png48]);
  writeFileSync(resolve(PUBLIC, 'favicon-bg.ico'), ico);
  console.log('  -> favicon-bg.ico (16/32/48)');

  console.log('Done!');
}

main().catch(console.error);
