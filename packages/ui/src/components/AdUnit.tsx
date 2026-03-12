/**
 * @file AdUnit.tsx
 * @description Google AdSense 수동 배치 광고 단위 컴포넌트
 * @module @pompcore/ui/AdUnit
 *
 * VITE_ADSENSE_CLIENT 환경변수가 없으면 렌더링하지 않는다.
 * 사용자의 핵심 기능 이용을 방해하지 않는 위치에만 배치한다.
 *
 * @see https://support.google.com/adsense/answer/9190028
 */

import { useEffect, useRef, type ReactNode } from 'react';

// ============================================================
// 타입
// ============================================================

interface AdUnitProps {
  /** AdSense 게시자 ID (ca-pub-XXXXXXXXXXXXXXXX) */
  client?: string;
  /** AdSense 광고 슬롯 ID */
  slot: string;
  /** 광고 형식 (기본: auto) */
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  /** 반응형 전체 너비 (기본: true) */
  responsive?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

// ============================================================
// AdUnit
// ============================================================

/** Google AdSense 수동 배치 광고 단위 */
export function AdUnit({
  client,
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdUnitProps): ReactNode {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const adsenseClient = client || (typeof import.meta !== 'undefined'
    ? (import.meta as any).env?.VITE_ADSENSE_CLIENT
    : '');

  useEffect(() => {
    if (!adsenseClient || !slot || pushed.current) return;

    try {
      const adsbygoogle = (window as any).adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      /* AdSense 스크립트가 아직 로드되지 않았거나 광고 차단기 사용 중 */
    }
  }, [adsenseClient, slot]);

  /* 환경변수가 없으면 렌더링하지 않음 */
  if (!adsenseClient || !slot) return null;

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
