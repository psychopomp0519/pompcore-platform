import { describe, it, expect } from 'vitest';
import { formatCurrency, formatSignedCurrency, CURRENCIES } from './currency';

describe('CURRENCIES', () => {
  it('6개 통화를 지원한다', () => {
    expect(Object.keys(CURRENCIES)).toHaveLength(6);
  });

  it('KRW는 소수점 0자리', () => {
    expect(CURRENCIES.KRW.decimals).toBe(0);
  });

  it('USD는 소수점 2자리', () => {
    expect(CURRENCIES.USD.decimals).toBe(2);
  });
});

describe('formatCurrency', () => {
  it('KRW 포맷', () => {
    expect(formatCurrency(10000, 'KRW', 'ko-KR')).toBe('₩10,000');
  });

  it('USD 포맷', () => {
    expect(formatCurrency(99.5, 'USD', 'en-US')).toBe('$99.50');
  });

  it('EUR 포맷', () => {
    const result = formatCurrency(1234.56, 'EUR', 'en-US');
    expect(result).toContain('€');
    expect(result).toContain('1,234.56');
  });

  it('JPY는 소수점 없음', () => {
    expect(formatCurrency(1000, 'JPY', 'en-US')).toBe('¥1,000');
  });

  it('음수 금액에 - 부호', () => {
    expect(formatCurrency(-5000, 'KRW', 'ko-KR')).toBe('-₩5,000');
  });

  it('0원 포맷', () => {
    expect(formatCurrency(0, 'KRW', 'ko-KR')).toBe('₩0');
  });

  it('미지원 통화 코드는 코드 자체를 심볼로 사용', () => {
    const result = formatCurrency(100, 'XYZ', 'en-US');
    expect(result).toContain('XYZ');
  });
});

describe('formatSignedCurrency', () => {
  it('양수에 + 부호', () => {
    expect(formatSignedCurrency(5000, 'KRW', 'ko-KR')).toBe('+₩5,000');
  });

  it('음수에 - 부호', () => {
    expect(formatSignedCurrency(-3000, 'KRW', 'ko-KR')).toBe('-₩3,000');
  });

  it('0에는 부호 없음', () => {
    expect(formatSignedCurrency(0, 'KRW', 'ko-KR')).toBe('₩0');
  });
});
