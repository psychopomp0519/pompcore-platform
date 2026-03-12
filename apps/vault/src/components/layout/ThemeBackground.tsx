/**
 * @file ThemeBackground.tsx
 * @description Nebula 테마 배경 - 라이트(하늘+입체구름), 다크(밤하늘+3단계 별+글로우 오브)
 * @module components/layout/ThemeBackground
 */

import { useMemo } from 'react';
import { useThemeStore } from '@pompcore/ui';
import { useThemePrefsStore } from '../../stores/themePrefsStore';

// ============================================================
// 상수
// ============================================================

/** 작은 별 (2px) 개수 */
const SMALL_STAR_COUNT = 25;
/** 중간 별 (3px) 개수 */
const MEDIUM_STAR_COUNT = 12;
/** 큰 별 (4px + 글로우) 개수 */
const LARGE_STAR_COUNT = 5;
/** 구름 개수 */
const CLOUD_COUNT = 5;

/** 별 카테고리별 크기 (px) */
const STAR_SIZE = {
  small: 2,
  medium: 3,
  large: 4,
} as const;

/** 큰 별 글로우 박스 쉐도우 */
const LARGE_STAR_GLOW = '0 0 6px 2px rgba(255,255,255,0.4)';

/** 구름 코어 크기 비율 (외곽 대비) */
const CLOUD_CORE_SCALE = 0.6;
/** 구름 코어 오프셋 비율 (외곽 대비) */
const CLOUD_CORE_OFFSET = 0.2;

// ============================================================
// 타입
// ============================================================

type StarCategory = 'small' | 'medium' | 'large';

interface StarData {
  id: string;
  size: number;
  category: StarCategory;
  left: number;
  top: number;
  delay: number;
  opacity: number;
}

interface CloudData {
  id: string;
  width: number;
  height: number;
  left: number;
  top: number;
  isSlowDrift: boolean;
  delay: number;
  /** 코어 너비 (px) */
  coreWidth: number;
  /** 코어 높이 (px) */
  coreHeight: number;
  /** 코어 X 오프셋 (px) */
  coreOffsetX: number;
  /** 코어 Y 오프셋 (px) */
  coreOffsetY: number;
}

// ============================================================
// 파티클 데이터 생성 (컴포넌트 외부에서 1회만 실행)
// ============================================================

/** 시드 기반 의사 난수 생성기 (순수 함수) */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/** 단일 카테고리 별 데이터 배열 생성 */
function generateStarCategory(
  count: number,
  category: StarCategory,
  seedOffset: number,
): StarData[] {
  const size = STAR_SIZE[category];
  return Array.from({ length: count }, (_, i) => ({
    id: `${category}-${seedOffset + i}`,
    size,
    category,
    left: seededRandom((seedOffset + i) * 5 + 1) * 100,
    top: seededRandom((seedOffset + i) * 5 + 2) * 100,
    delay: seededRandom((seedOffset + i) * 5 + 3) * 4,
    opacity: 0.2 + seededRandom((seedOffset + i) * 5 + 4) * 0.6,
  }));
}

/** 3단계 별 파티클 데이터 생성 */
function generateStars(): StarData[] {
  return [
    ...generateStarCategory(SMALL_STAR_COUNT, 'small', 0),
    ...generateStarCategory(MEDIUM_STAR_COUNT, 'medium', SMALL_STAR_COUNT),
    ...generateStarCategory(LARGE_STAR_COUNT, 'large', SMALL_STAR_COUNT + MEDIUM_STAR_COUNT),
  ];
}

/** 2레이어 입체 구름 데이터 생성 */
function generateClouds(): CloudData[] {
  return Array.from({ length: CLOUD_COUNT }, (_, i) => {
    const width = 120 + seededRandom(i * 4 + 100) * 200;
    const height = 40 + seededRandom(i * 4 + 101) * 60;
    return {
      id: `cloud-${i}`,
      width,
      height,
      left: seededRandom(i * 4 + 102) * 100,
      top: 10 + seededRandom(i * 4 + 103) * 60,
      isSlowDrift: i % 2 === 0,
      delay: i * 3,
      coreWidth: width * CLOUD_CORE_SCALE,
      coreHeight: height * CLOUD_CORE_SCALE,
      coreOffsetX: width * CLOUD_CORE_OFFSET,
      coreOffsetY: height * CLOUD_CORE_OFFSET,
    };
  });
}

// ============================================================
// Glow Orbs (다크모드 배경 글로우)
// ============================================================

/** 다크모드 배경에 은은한 색상 글로우를 추가하는 장식 요소 */
function GlowOrbs(): React.ReactNode {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* 보라빛 글로우 */}
      <div className="absolute top-[10%] left-[30%] w-[400px] h-[400px] bg-[#7C3AED]/[0.05] rounded-full blur-[120px]" />
      {/* 골드 글로우 */}
      <div className="absolute top-[60%] right-[20%] w-[300px] h-[300px] bg-[#FFD700]/[0.025] rounded-full blur-[100px]" />
      {/* 핑크 글로우 */}
      <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] bg-[#EC4899]/[0.03] rounded-full blur-[100px]" />
    </div>
  );
}

// ============================================================
// 별 파티클 (다크모드)
// ============================================================

/** 3단계 크기의 별 파티클 렌더링 */
function Stars(): React.ReactNode {
  const stars = useMemo(() => generateStars(), []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle motion-reduce:animate-none"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
            boxShadow: star.category === 'large' ? LARGE_STAR_GLOW : undefined,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// 구름 파티클 (라이트모드)
// ============================================================

/** 2레이어 입체 구름 렌더링 (외곽 + 코어) */
function Clouds(): React.ReactNode {
  const clouds = useMemo(() => generateClouds(), []);
  const driftClass = (slow: boolean): string =>
    slow ? 'animate-cloud-drift-slow' : 'animate-cloud-drift';

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className={`absolute ${driftClass(cloud.isSlowDrift)} motion-reduce:animate-none`}
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          {/* 외곽 레이어: 넓고 연한 가장자리 */}
          <div
            className="absolute rounded-full bg-white/40 blur-[25px]"
            style={{
              width: `${cloud.width}px`,
              height: `${cloud.height}px`,
            }}
          />
          {/* 코어 레이어: 좁고 진한 중심부 */}
          <div
            className="absolute rounded-full bg-white/80 blur-[10px]"
            style={{
              width: `${cloud.coreWidth}px`,
              height: `${cloud.coreHeight}px`,
              left: `${cloud.coreOffsetX}px`,
              top: `${cloud.coreOffsetY}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// ThemeBackground
// ============================================================

/** Nebula 테마 배경 컴포넌트 */
export function ThemeBackground(): React.ReactNode {
  const isDarkMode = useThemeStore((state) => state.theme) === 'dark';
  const showAnimations = useThemePrefsStore((s) => s.showAnimations);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {isDarkMode ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-surface-dark-1 via-surface-dark-2 to-surface-dark-3" />
          {showAnimations && <GlowOrbs />}
          {showAnimations && <Stars />}
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-sky-deep via-sky-mid to-sky-pale" />
          {showAnimations && <Clouds />}
        </>
      )}
    </div>
  );
}
