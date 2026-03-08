/**
 * @file PasswordStrengthBar — Password strength meter with rule checklist
 * @module @pompcore/ui/PasswordStrengthBar
 */

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { evaluatePassword, type PasswordStrengthLevel } from '../utils/passwordStrength';

const TOTAL_SEGMENTS = 5;

const SEGMENT_COLORS: Record<PasswordStrengthLevel, string> = {
  empty:         'bg-navy/10 dark:bg-white/10',
  weak:          'bg-red-400',
  fair:          'bg-amber-400',
  strong:        'bg-emerald-400',
  'very-strong': 'bg-app-accent',
};

const LABEL_COLORS: Record<PasswordStrengthLevel, string> = {
  empty:         '',
  weak:          'text-red-500 dark:text-red-400',
  fair:          'text-amber-500 dark:text-amber-400',
  strong:        'text-emerald-500 dark:text-emerald-400',
  'very-strong': 'text-app-accent',
};

interface PasswordStrengthBarProps {
  password: string;
}

/** 비밀번호 강도 막대 + 규칙 체크리스트 */
export function PasswordStrengthBar({ password }: PasswordStrengthBarProps): ReactNode {
  const result = useMemo(() => evaluatePassword(password), [password]);

  if (password.length === 0) return null;

  const filledColor = SEGMENT_COLORS[result.level];
  const emptyColor  = SEGMENT_COLORS.empty;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" role="meter" aria-label="비밀번호 강도" aria-valuenow={result.score} aria-valuemin={0} aria-valuemax={TOTAL_SEGMENTS}>
          {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < result.score ? filledColor : emptyColor
              }`}
            />
          ))}
        </div>
        {result.label && (
          <span className={`text-xs font-medium ${LABEL_COLORS[result.level]}`}>
            {result.label}
          </span>
        )}
      </div>
      <ul className="space-y-1">
        {result.rules.map((rule) => (
          <li key={rule.id} className="flex items-center gap-1.5 text-xs">
            {rule.passed ? (
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-app-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-navy/30 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
            <span className={rule.passed ? 'text-navy/70 dark:text-gray-300' : 'text-navy/40 dark:text-gray-500'}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
