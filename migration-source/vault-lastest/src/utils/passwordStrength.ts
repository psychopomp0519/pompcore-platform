/**
 * @file passwordStrength.ts
 * @description 비밀번호 강도 평가 유틸리티
 * @module utils/passwordStrength
 */

// ============================================================
// 상수
// ============================================================

const MIN_LENGTH = 8;

// ============================================================
// 규칙 정의
// ============================================================

interface Rule {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { id: 'length',    label: `8자 이상`,        test: (pw) => pw.length >= MIN_LENGTH },
  { id: 'uppercase', label: '대문자 포함 (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lowercase', label: '소문자 포함 (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number',    label: '숫자 포함 (0-9)',   test: (pw) => /[0-9]/.test(pw) },
  { id: 'special',   label: '특수문자 포함',     test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

// ============================================================
// 타입
// ============================================================

export interface PasswordRuleResult {
  id: string;
  label: string;
  passed: boolean;
}

export type PasswordStrengthLevel = 'empty' | 'weak' | 'fair' | 'strong' | 'very-strong';

export interface PasswordStrengthResult {
  /** 충족된 규칙 수 (0–5) */
  score: number;
  /** 강도 레벨 */
  level: PasswordStrengthLevel;
  /** 강도 레벨 한국어 라벨 */
  label: string;
  /** 규칙별 통과 여부 */
  rules: PasswordRuleResult[];
  /** 모든 규칙 충족 여부 (제출 가능 여부) */
  isValid: boolean;
}

// ============================================================
// 평가 함수
// ============================================================

/** 비밀번호 강도를 평가하여 PasswordStrengthResult 반환 */
export function evaluatePassword(password: string): PasswordStrengthResult {
  const rules = RULES.map((r) => ({ id: r.id, label: r.label, passed: r.test(password) }));
  const score = password.length === 0 ? 0 : rules.filter((r) => r.passed).length;

  const level = getLevel(score, password.length);
  const label = LEVEL_LABELS[level];
  const isValid = score === RULES.length;

  return { score, level, label, rules, isValid };
}

// ============================================================
// 내부 헬퍼
// ============================================================

const LEVEL_LABELS: Record<PasswordStrengthLevel, string> = {
  empty:       '',
  weak:        '약함',
  fair:        '보통',
  strong:      '강함',
  'very-strong': '매우 강함',
};

function getLevel(score: number, length: number): PasswordStrengthLevel {
  if (length === 0) return 'empty';
  if (score <= 2)   return 'weak';
  if (score === 3)  return 'fair';
  if (score === 4)  return 'strong';
  return 'very-strong';
}
