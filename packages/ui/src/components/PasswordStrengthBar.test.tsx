import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { PasswordStrengthBar } from './PasswordStrengthBar';

afterEach(cleanup);

describe('PasswordStrengthBar', () => {
  it('빈 비밀번호일 때 렌더링 안 함', () => {
    const { container } = render(<PasswordStrengthBar password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('비밀번호 입력 시 meter 표시', () => {
    render(<PasswordStrengthBar password="test" />);
    expect(screen.getByRole('meter')).toBeInTheDocument();
  });

  it('약한 비밀번호에 라벨 표시', () => {
    render(<PasswordStrengthBar password="ab" />);
    // 'ab'는 소문자만 = score 1 = weak = '약함'
    expect(screen.getByText('약함')).toBeInTheDocument();
  });

  it('강한 비밀번호 → "매우 강함" 라벨', () => {
    render(<PasswordStrengthBar password="Abcdef1!" />);
    expect(screen.getByText('매우 강함')).toBeInTheDocument();
  });

  it('규칙 체크리스트 표시', () => {
    const { container } = render(<PasswordStrengthBar password="test" />);
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(5);
  });

  it('meter aria-valuenow 설정', () => {
    render(<PasswordStrengthBar password="Abcdef1!" />);
    const meter = screen.getByRole('meter');
    expect(meter.getAttribute('aria-valuenow')).toBe('5');
  });

  it('meter aria-valuemax = 5', () => {
    render(<PasswordStrengthBar password="x" />);
    const meter = screen.getByRole('meter');
    expect(meter.getAttribute('aria-valuemax')).toBe('5');
  });
});
