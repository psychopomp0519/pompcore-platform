import { describe, it, expect } from 'vitest';
import { generateCSV, generateCSVFromObjects } from './csv';

describe('generateCSV', () => {
  it('헤더와 행으로 CSV 생성', () => {
    const csv = generateCSV(['이름', '금액'], [['커피', 4500], ['교통', 1350]]);
    const lines = csv.replace('\uFEFF', '').split('\r\n');
    expect(lines[0]).toBe('이름,금액');
    expect(lines[1]).toBe('커피,4500');
    expect(lines[2]).toBe('교통,1350');
  });

  it('BOM 포함', () => {
    const csv = generateCSV(['a'], [['b']]);
    expect(csv.startsWith('\uFEFF')).toBe(true);
  });

  it('쉼표 포함 셀 이스케이프', () => {
    const csv = generateCSV(['이름'], [['a,b']]);
    expect(csv).toContain('"a,b"');
  });

  it('따옴표 포함 셀 이중 이스케이프', () => {
    const csv = generateCSV(['이름'], [['say "hi"']]);
    expect(csv).toContain('"say ""hi"""');
  });

  it('줄바꿈 포함 셀 이스케이프', () => {
    const csv = generateCSV(['메모'], [['line1\nline2']]);
    expect(csv).toContain('"line1\nline2"');
  });

  it('null/undefined → 빈 문자열', () => {
    const csv = generateCSV(['a', 'b'], [[null, undefined]]);
    const lines = csv.replace('\uFEFF', '').split('\r\n');
    expect(lines[1]).toBe(',');
  });

  it('boolean → Y/N', () => {
    const csv = generateCSV(['활성'], [[true], [false]]);
    const lines = csv.replace('\uFEFF', '').split('\r\n');
    expect(lines[1]).toBe('Y');
    expect(lines[2]).toBe('N');
  });

  it('빈 행 배열', () => {
    const csv = generateCSV(['이름'], []);
    const lines = csv.replace('\uFEFF', '').split('\r\n');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('이름');
  });
});

describe('generateCSVFromObjects', () => {
  it('객체 배열에서 컬럼 기반 CSV 생성', () => {
    const data = [
      { name: '급여', amount: 3000000, type: 'income' },
      { name: '식비', amount: 150000, type: 'expense' },
    ];
    const columns = [
      { key: 'name' as const, label: '이름' },
      { key: 'amount' as const, label: '금액' },
      { key: 'type' as const, label: '유형' },
    ];
    const csv = generateCSVFromObjects(columns, data);
    const lines = csv.replace('\uFEFF', '').split('\r\n');
    expect(lines[0]).toBe('이름,금액,유형');
    expect(lines[1]).toBe('급여,3000000,income');
    expect(lines[2]).toBe('식비,150000,expense');
  });

  it('빈 데이터 배열', () => {
    const csv = generateCSVFromObjects([{ key: 'x', label: 'X' }], []);
    const lines = csv.replace('\uFEFF', '').split('\r\n');
    expect(lines).toHaveLength(1);
  });
});
