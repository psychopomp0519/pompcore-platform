/**
 * @file Shared icon props interface
 * @module @pompcore/ui/icons/types
 */
import type { SVGProps } from 'react';

/** 모든 아이콘 컴포넌트에서 공유하는 Props 인터페이스 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  /** 아이콘 크기 (px). width/height에 동시 적용 */
  size?: number;
}

/** SVG 기본 속성 생성 헬퍼 */
export function svgDefaults(size: number = 24): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}
