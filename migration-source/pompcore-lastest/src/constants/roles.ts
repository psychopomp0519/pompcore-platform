/**
 * 사용자 역할(Role) 상수 및 권한 정의
 * - 팀장(leader): 최고 권한 — 지원서 열람, 프로젝트 개요 열람, 팀 관리
 * - 팀원(member): 프로젝트 개요 열람, 내부 문서 접근
 * - 사용자(user): 사이트 일반 이용 (기본 권한)
 */

/** 역할 타입 */
export type UserRole = 'leader' | 'member' | 'user';

/** 역할별 한국어 라벨 */
export const ROLE_LABELS: Record<UserRole, string> = {
  leader: '팀장',
  member: '팀원',
  user: '사용자',
};

/** 권한 목록 */
export type Permission =
  | 'view_applications'      // 지원서 열람
  | 'manage_team'            // 팀 관리 (역할 변경 등)
  | 'view_project_overview'  // 프로젝트 개요 열람
  | 'view_internal_docs'     // 내부 문서 접근
  | 'use_services'           // 서비스 이용 (기본)
  | 'manage_profile';        // 프로필 관리 (기본)

/** 역할별 권한 매핑 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  leader: [
    'view_applications',
    'manage_team',
    'view_project_overview',
    'view_internal_docs',
    'use_services',
    'manage_profile',
  ],
  member: [
    'view_project_overview',
    'view_internal_docs',
    'use_services',
    'manage_profile',
  ],
  user: [
    'use_services',
    'manage_profile',
  ],
};

/** 특정 역할이 특정 권한을 가지는지 확인 */
export function hasPermission(role: UserRole | undefined | null, permission: Permission): boolean {
  if (!role || !(role in ROLE_PERMISSIONS)) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}
