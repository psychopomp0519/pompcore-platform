/**
 * @file Starfield — 다크 모드 별 파티클 컴포넌트
 * @description 섹션 배경에 반짝이는 별 효과를 렌더링한다. 다크 모드에서만 표시.
 */

interface StarfieldProps {
  /** 별 개수 */
  count: number;
  /** 위치 분산 계수 (vertical) — 기본 6.2 */
  spreadY?: number;
  /** 위치 분산 계수 (horizontal) — 기본 6.7 */
  spreadX?: number;
  /** 기본 투명도 — 기본 0.2 */
  baseOpacity?: number;
  /** 투명도 증가분 — 기본 0.15 */
  opacityStep?: number;
  /** 애니메이션 딜레이 간격 (초) — 기본 0.27 */
  delayStep?: number;
}

function Starfield({
  count,
  spreadY = 6.2,
  spreadX = 6.7,
  baseOpacity = 0.2,
  opacityStep = 0.15,
  delayStep = 0.27,
}: StarfieldProps): React.ReactElement {
  return (
    <div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle"
          style={{
            top: `${3 + (i * spreadY) % 88}%`,
            left: `${2 + (i * spreadX) % 93}%`,
            animationDelay: `${(i * delayStep).toFixed(2)}s`,
            opacity: baseOpacity + (i % 3) * opacityStep,
          }}
        />
      ))}
    </div>
  );
}

export default Starfield;
