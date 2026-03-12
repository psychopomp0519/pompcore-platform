/**
 * @file csv.ts
 * @description CSV 생성 및 다운로드 유틸리티
 * @module utils/csv
 */

// ============================================================
// 상수
// ============================================================

/** UTF-8 BOM (엑셀에서 한글 깨짐 방지) */
const UTF8_BOM = '\uFEFF';

// ============================================================
// CSV 생성
// ============================================================

/** CSV 셀 이스케이프: 쉼표/따옴표/줄바꿈 포함 시 큰따옴표로 감싸기 */
function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** 값을 문자열로 변환 (null/undefined → 빈 문자열) */
function toStringValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'Y' : 'N';
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return String(value);
}

/**
 * 헤더와 행 데이터로 CSV 문자열 생성
 * @param headers - 컬럼 헤더 배열
 * @param rows - 각 행의 값 배열 (순서는 headers와 일치)
 * @returns BOM 포함 CSV 문자열
 */
export function generateCSV(headers: string[], rows: unknown[][]): string {
  const headerLine = headers.map(escapeCell).join(',');
  const dataLines = rows.map((row) =>
    row.map((cell) => escapeCell(toStringValue(cell))).join(','),
  );
  return UTF8_BOM + [headerLine, ...dataLines].join('\r\n');
}

/**
 * 객체 배열에서 CSV 생성 (키 기반)
 * @param columns - { key, label } 배열 (순서대로 컬럼 구성)
 * @param data - 객체 배열
 * @returns BOM 포함 CSV 문자열
 */
export function generateCSVFromObjects<T extends Record<string, unknown>>(
  columns: { key: keyof T & string; label: string }[],
  data: T[],
): string {
  const headers = columns.map((col) => col.label);
  const rows = data.map((item) =>
    columns.map((col) => item[col.key]),
  );
  return generateCSV(headers, rows);
}

// ============================================================
// 다운로드
// ============================================================

/**
 * CSV 문자열을 파일로 다운로드
 * @param filename - 파일명 (.csv 확장자 포함)
 * @param csvContent - generateCSV로 생성한 CSV 문자열
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
