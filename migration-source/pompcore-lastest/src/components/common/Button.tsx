/**
 * 공통 버튼 컴포넌트
 * - 라이트/다크 모드 모두 대응
 * - variant로 스타일 변경, size로 크기 조절
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white hover:from-[#6D28D9] hover:to-[#9333EA] shadow-[0_4px_20px_rgba(124,58,237,0.2)] dark:shadow-[0_0_24px_rgba(124,58,237,0.25)]',
  secondary:
    'bg-white border border-[#E0D8F0] text-[#7C3AED] hover:bg-brand-50 dark:bg-white/[0.03] dark:border-white/10 dark:text-[#A090C0] dark:hover:bg-white/[0.06]',
  ghost:
    'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5',
  outline:
    'border border-brand-500 text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10',
};

/** 최소 터치 타겟 44px 보장 (WCAG 2.1 / Apple HIG) */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-sm rounded-lg min-h-[44px]',
  md: 'px-6 py-2.5 text-base rounded-xl min-h-[44px]',
  lg: 'px-8 py-3 text-lg rounded-xl min-h-[48px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-300 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
