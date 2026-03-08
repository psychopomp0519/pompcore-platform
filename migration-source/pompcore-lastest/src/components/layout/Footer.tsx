/**
 * 푸터 컴포넌트
 * - PompCore 전역 하단 영역
 * - 라이트/다크 모드 대응
 */
import { Link } from 'react-router-dom';
import { PROJECTS } from '../../constants/projects';
import { DynamicIcon } from '../icons/Icons';
import { PompCoreLogo } from '../common/BrandText';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 mt-auto bg-white dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="mb-3"><PompCoreLogo size="text-lg" /></h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              일상을 더 스마트하게 만드는<br />
              디지털 서비스 플랫폼
            </p>
          </div>

          {/* 프로젝트 링크 (자동 생성) */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">프로젝트</h4>
            <ul className="space-y-2">
              {PROJECTS.map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects#${project.id}`}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <DynamicIcon name={project.icon} size={14} fallback={project.icon} />
                      {project.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 법적 고지 */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">안내</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  회사 소개
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="border-t border-slate-200 dark:border-white/10 mt-8 pt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {currentYear} PompCore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
