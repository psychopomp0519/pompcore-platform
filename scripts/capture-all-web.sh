#!/bin/bash
# @file capture-all-web.sh
# @description Web 앱 전체 페이지 일괄 스크린샷 캡처
# @usage ./scripts/capture-all-web.sh

set -e

PAGES=(
  "/ home-desktop 1280 800"
  "/ home-mobile 390 844"
  "/projects projects-desktop 1280 800"
  "/projects projects-mobile 390 844"
  "/announcements announce-desktop 1280 800"
  "/announcements announce-mobile 390 844"
  "/patchnotes patch-desktop 1280 800"
  "/patchnotes patch-mobile 390 844"
  "/about about-desktop 1280 800"
  "/auth/login login-desktop 1280 800"
  "/auth/login login-mobile 390 844"
  "/auth/register register-desktop 1280 800"
  "/nonexistent 404-desktop 1280 800"
)

echo "=== Web 앱 일괄 캡처 시작 ==="
echo ""

for entry in "${PAGES[@]}"; do
  echo "📸 Capturing: $entry"
  node scripts/screenshot.mjs $entry
  echo ""
done

echo "=== 완료! screenshots/ 폴더 확인 ==="
ls -la screenshots/*.png | wc -l
echo "개의 스크린샷 생성됨"
