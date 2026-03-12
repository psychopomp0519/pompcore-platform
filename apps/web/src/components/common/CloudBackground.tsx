/**
 * @file CloudBackground — 라이트 모드 구름 장식 컴포넌트
 * @description 섹션 배경에 애니메이션 구름을 렌더링한다. 라이트 모드에서만 표시.
 */

/** 복합 구름 (가장자리 블러 + 코어) */
interface CompositeCloud {
  type: 'composite';
  position: string;
  outerSize: string;
  innerSize: string;
  outerBlur: string;
  innerBlur: string;
  outerOpacity?: string;
  innerOpacity?: string;
  animation: 'animate-cloud-drift' | 'animate-cloud-drift-slow';
  delay: string;
}

/** 단순 구름 */
interface SimpleCloud {
  type: 'simple';
  position: string;
  size: string;
  blur: string;
  opacity?: string;
  animation: 'animate-cloud-drift' | 'animate-cloud-drift-slow';
  delay: string;
}

type CloudConfig = CompositeCloud | SimpleCloud;

interface CloudBackgroundProps {
  clouds: CloudConfig[];
}

function CloudBackground({ clouds }: CloudBackgroundProps): React.ReactElement {
  return (
    <div className="dark:hidden absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {clouds.map((cloud, i) => {
        if (cloud.type === 'composite') {
          return (
            <div key={i} className={cloud.animation} style={{ animationDelay: cloud.delay }}>
              <div className={`absolute ${cloud.position} ${cloud.outerSize} ${cloud.outerOpacity ?? 'bg-white/40'} rounded-full ${cloud.outerBlur}`} />
              <div className={`absolute ${cloud.position} ${cloud.innerSize} ${cloud.innerOpacity ?? 'bg-white/75'} rounded-full ${cloud.innerBlur}`} />
            </div>
          );
        }
        return (
          <div key={i} className={cloud.animation} style={{ animationDelay: cloud.delay }}>
            <div className={`absolute ${cloud.position} ${cloud.size} ${cloud.opacity ?? 'bg-white/82'} rounded-full ${cloud.blur}`} />
          </div>
        );
      })}
    </div>
  );
}

export default CloudBackground;
export type { CloudConfig };
