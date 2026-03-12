/**
 * 지원서 로컬스토리지 관리 서비스
 * - Recruit, RecruitAdmin 페이지에서 공통 사용
 * - 향후 Supabase 연동 시 이 파일만 수정하면 됨
 *
 * @warning 현재 localStorage 기반이므로 브라우저 초기화 시 데이터가 유실됩니다.
 *          Supabase 테이블 연동 후 이 파일의 구현만 교체하면 모든 소비자에 반영됩니다.
 */
import type { ApplicationForm } from '../constants/recruitment';

const STORAGE_KEY = 'pompcore_applications';

/** 저장된 지원서 목록 로드 */
export function loadApplications(): ApplicationForm[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** 지원서 저장 */
export function saveApplication(app: ApplicationForm): void {
  const existing = loadApplications();
  existing.push(app);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

/** 지원서 삭제 (인덱스 기반) — 삭제 후 목록 반환 */
export function deleteApplication(index: number): ApplicationForm[] {
  const existing = loadApplications();
  const updated = existing.filter((_, i) => i !== index);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
