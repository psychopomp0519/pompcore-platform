/**
 * 카드 컴포넌트
 * - 라이트: 깔끔한 화이트 카드 + 미묘한 그림자
 * - 다크: 글래스모피즘 반투명 카드
 * - 호버 시 부드러운 스케일업 효과
 */
import type { HTMLAttributes, ReactNode } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function GlassCard({
  children,
  hoverable = true,
  padding = 'md',
  className = '',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`
        card
        ${paddingStyles[padding]}
        ${hoverable ? 'hover-lift' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
