import { describe, it, expect } from 'vitest';
import { formatCompact, CHART_THEME } from './chartHelpers';

describe('formatCompact', () => {
  it('1만 이상 → N만', () => {
    expect(formatCompact(50000)).toBe('5만');
  });

  it('10만 → 10만', () => {
    expect(formatCompact(100000)).toBe('10만');
  });

  it('1천~9999 → N천', () => {
    expect(formatCompact(3000)).toBe('3천');
  });

  it('1000 미만 → 그대로', () => {
    expect(formatCompact(500)).toBe('500');
  });

  it('0 → 0', () => {
    expect(formatCompact(0)).toBe('0');
  });

  it('음수 -5만 → -5만', () => {
    expect(formatCompact(-50000)).toBe('-5만');
  });

  it('음수 -3천 → -3천', () => {
    expect(formatCompact(-3000)).toBe('-3천');
  });
});

describe('CHART_THEME', () => {
  it('text fontSize 11', () => {
    expect(CHART_THEME.text.fontSize).toBe(11);
  });

  it('axis ticks fontSize 10', () => {
    expect(CHART_THEME.axis.ticks.text.fontSize).toBe(10);
  });

  it('grid line에 dash 패턴', () => {
    expect(CHART_THEME.grid.line.strokeDasharray).toBe('4 4');
  });
});
