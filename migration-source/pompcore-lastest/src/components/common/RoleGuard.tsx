/**
 * 역할 기반 접근 제어 컴포넌트
 * - 특정 권한이 있는 사용자에게만 콘텐츠 표시
 * - 미인증 또는 권한 부족 시 fallback UI 렌더링
 */
import { useAuthStore } from '../../store/authStore';
import { hasPermission } from '../../constants/roles';
import type { Permission } from '../../constants/roles';

interface RoleGuardProps {
  /** 필요한 권한 */
  requires: Permission;
  /** 권한이 있을 때 표시할 콘텐츠 */
  children: React.ReactNode;
  /** 권한 부족 시 대체 UI (기본: 접근 불가 메시지) */
  fallback?: React.ReactNode;
}

export default function RoleGuard({ requires, children, fallback }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);

  /** 미로그인 */
  if (!user) {
    return (
      <>
        {fallback ?? (
          <section className="bg-surface-light dark:bg-surface-dark-1 min-h-screen flex items-center justify-center">
            <div className="text-center px-6">
              <h1 className="font-display text-xl font-bold text-[#1A1A2E] dark:text-white mb-3">
                로그인이 필요합니다
              </h1>
              <p className="text-sm text-[#4A4270] dark:text-[#6A5490]">
                이 페이지에 접근하려면 먼저 로그인하세요.
              </p>
            </div>
          </section>
        )}
      </>
    );
  }

  /** 권한 확인 */
  if (!hasPermission(user.role, requires)) {
    return (
      <>
        {fallback ?? (
          <section className="bg-surface-light dark:bg-surface-dark-1 min-h-screen flex items-center justify-center">
            <div className="text-center px-6">
              <h1 className="font-display text-xl font-bold text-[#1A1A2E] dark:text-white mb-3">
                접근 권한이 없습니다
              </h1>
              <p className="text-sm text-[#4A4270] dark:text-[#6A5490]">
                이 페이지는 권한이 있는 팀원만 열람할 수 있습니다.
              </p>
            </div>
          </section>
        )}
      </>
    );
  }

  return <>{children}</>;
}
