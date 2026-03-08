/**
 * 헤더 컴포넌트
 * - PompCore 전역 네비게이션 바
 * - 스크롤 시 배경 활성화, 라이트/다크 모드 대응
 * - 다크 모드 토글 버튼 포함
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@pompcore/auth';
import { Button, ThemeToggle } from '@pompcore/ui';
import pompcoreLogo from '../../assets/logos/pompcorelogo.svg';
import { PompCoreLogo } from '../common/BrandText';

/** 네비게이션 메뉴 항목 (확장 시 여기에 추가) */
const NAV_ITEMS = [
  { label: '홈', path: '/' },
  { label: '프로젝트', path: '/projects' },
  { label: '공지사항', path: '/announcements' },
  { label: '패치노트', path: '/patchnotes' },
  { label: '소개', path: '/about' },
  { label: '팀원 모집', path: '/recruit' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAuthLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);

  /** 스크롤 감지하여 헤더 배경 변경 */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /** 페이지 이동 시 모바일 메뉴 닫기 */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-white/80 dark:bg-[#0C0818]/80 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-white/10 py-3'
          : 'bg-transparent py-5'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={pompcoreLogo} alt="PompCore" className="h-6 w-6 dark:invert" />
          <PompCoreLogo />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8" aria-label="메인 네비게이션">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-current={location.pathname === item.path ? 'page' : undefined}
              className={`
                text-sm font-medium transition-colors duration-200
                ${location.pathname === item.path
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 우측 버튼들 */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthLoading ? (
            <div className="w-[140px] h-8 rounded-lg bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          ) : user ? (
            <>
              <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                {user.displayName ?? user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>로그아웃</Button>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">로그인</Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="primary" size="sm">시작하기</Button>
              </Link>
            </>
          )}
        </div>

        {/* 모바일: 테마 토글 + 햄버거 */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-slate-700 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 mt-2 mx-4 p-4 rounded-2xl shadow-lg animate-fade-in">
          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2"
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-slate-200 dark:border-white/10 my-2" />
            {isAuthLoading ? (
              <div className="w-full h-8 rounded-lg bg-slate-200/50 dark:bg-white/5 animate-pulse" />
            ) : user ? (
              <>
                <span className="text-sm text-slate-600 dark:text-slate-300 px-2 py-2 truncate">
                  {user.displayName ?? user.email}
                </span>
                <Button variant="ghost" size="sm" className="w-full" onClick={logout}>로그아웃</Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm" className="w-full">로그인</Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="primary" size="sm" className="w-full">시작하기</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
