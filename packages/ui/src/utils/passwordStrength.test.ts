import { describe, it, expect } from 'vitest';
import { evaluatePassword } from './passwordStrength';
import type { PasswordStrengthLevel } from './passwordStrength';

describe('evaluatePassword', () => {
  it('빈 문자열 → empty', () => {
    const result = evaluatePassword('');
    expect(result.level).toBe('empty' satisfies PasswordStrengthLevel);
    expect(result.score).toBe(0);
    expect(result.isValid).toBe(false);
    expect(result.label).toBe('');
  });

  it('짧고 소문자만 → weak', () => {
    const result = evaluatePassword('abc');
    expect(result.level).toBe('weak');
    expect(result.isValid).toBe(false);
  });

  it('8자 이상 소문자+숫자 → fair (3개 규칙)', () => {
    const result = evaluatePassword('abcdefgh1');
    expect(result.level).toBe('fair');
    expect(result.score).toBe(3); // length + lowercase + number
  });

  it('8자 이상 대소문자+숫자 → fair (3개 규칙)', () => {
    const result = evaluatePassword('Abcdefg1');
    expect(result.score).toBe(4); // length + upper + lower + number
    expect(result.level).toBe('strong');
  });

  it('모든 규칙 충족 → very-strong', () => {
    const result = evaluatePassword('Abcdef1!');
    expect(result.score).toBe(5);
    expect(result.level).toBe('very-strong');
    expect(result.label).toBe('매우 강함');
    expect(result.isValid).toBe(true);
  });

  it('규칙 결과 5개 반환', () => {
    const result = evaluatePassword('test');
    expect(result.rules).toHaveLength(5);
    expect(result.rules.every((r) => 'id' in r && 'label' in r && 'passed' in r)).toBe(true);
  });

  it('특수문자만 있는 짧은 문자열', () => {
    const result = evaluatePassword('!@#');
    expect(result.rules.find((r) => r.id === 'special')?.passed).toBe(true);
    expect(result.rules.find((r) => r.id === 'length')?.passed).toBe(false);
  });
});
