/**
 * UpcomingSection — 곧 만나볼 서비스
 * - constants/upcoming.ts 데이터 기반 자동 렌더링
 * - 알림 신청 CTA 포함
 */
import { Link } from 'react-router-dom';
import { UPCOMING_SERVICES, UPCOMING_STATUS_LABELS } from '../../constants/upcoming';
import { EMERALD, AMBER } from '../../constants/colors';
import { DynamicIcon, BellIcon } from '../../components/icons/Icons';
import BrandText from '../../components/common/BrandText';
import CloudBackground from '../../components/common/CloudBackground';
import type { CloudConfig } from '../../components/common/CloudBackground';
import Starfield from '../../components/common/Starfield';

/** 구름 배경 설정 (라이트 모드 전용) */
const CLOUDS: CloudConfig[] = [
  {
    type: 'composite',
    position: 'top-[6%] left-[18%]',
    outerSize: 'w-[200px] md:w-[330px] h-[55px] md:h-[82px]',
    innerSize: 'w-[140px] md:w-[240px] h-[40px] md:h-[58px]',
    outerBlur: 'blur-[26px]',
    innerBlur: 'blur-[11px]',
    outerOpacity: 'bg-white/40',
    innerOpacity: 'bg-white/[0.76]',
    animation: 'animate-cloud-drift',
    delay: '6s',
  },
  {
    type: 'composite',
    position: 'bottom-[10%] right-[12%]',
    outerSize: 'w-[180px] md:w-[290px] h-[50px] md:h-[75px]',
    innerSize: 'w-[120px] md:w-[200px] h-[36px] md:h-[52px]',
    outerBlur: 'blur-[24px]',
    innerBlur: 'blur-[10px]',
    outerOpacity: 'bg-white/[0.38]',
    innerOpacity: 'bg-white/[0.74]',
    animation: 'animate-cloud-drift-slow',
    delay: '13s',
  },
  {
    type: 'simple',
    position: 'top-[30%] right-[8%]',
    size: 'w-[90px] md:w-[150px] h-[30px] md:h-[44px]',
    blur: 'blur-[8px]',
    opacity: 'bg-white/80',
    animation: 'animate-cloud-drift',
    delay: '3s',
  },
  {
    type: 'simple',
    position: 'bottom-[28%] left-[40%]',
    size: 'w-[85px] md:w-[140px] h-[28px] md:h-[40px]',
    blur: 'blur-[7px]',
    opacity: 'bg-white/[0.78]',
    animation: 'animate-cloud-drift-slow',
    delay: '18s',
  },
];

export default function UpcomingSection() {
  return (
    <section className="snap-section bg-gradient-to-b from-sky-soft to-sky-mist dark:from-surface-dark-3 dark:to-surface-dark-3 relative overflow-hidden py-12 flex flex-col justify-center">
      {/* 배경 글로우 */}
      <div className="absolute top-[10%] right-[10%] w-[250px] md:w-[300px] lg:w-[350px] h-[250px] md:h-[300px] lg:h-[350px] bg-sky-deep/[0.1] dark:bg-accent-gold/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[250px] md:w-[300px] lg:w-[350px] h-[250px] md:h-[300px] lg:h-[350px] bg-sky-mid/[0.12] dark:bg-brand/[0.04] rounded-full blur-[100px] pointer-events-none" />
      {/* 구름 (라이트 전용) */}
      <CloudBackground clouds={CLOUDS} />
      {/* 별 (다크 전용) */}
      <Starfield count={10} spreadY={8.5} spreadX={9.3} delayStep={0.29} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-display text-xl sm:text-[28px] font-bold text-[#1A1A2E] dark:text-white mb-3">
            곧 만나볼 <span className="text-gradient">서비스</span>
          </h2>
          <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">
            PompCore에서 준비 중인 새로운 경험들
          </p>
        </div>

        {/* 3열 카드 그리드 */}
        {UPCOMING_SERVICES.length === 0 ? (
          <div className="text-center py-12 mb-12">
            <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">준비 중인 서비스가 없습니다.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {UPCOMING_SERVICES.map((svc) => (
            <div
              key={svc.id}
              className="rounded-2xl p-4 sm:p-6 bg-white/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-center transition-all duration-300 hover:border-brand/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.06)]"
            >
              {/* 아이콘 */}
              <div
                className="w-[60px] h-[60px] rounded-2xl mx-auto flex items-center justify-center mb-4"
                style={{ background: `${svc.accentColor}15`, color: svc.accentColor }}
              >
                <DynamicIcon name={svc.icon} size={32} fallback={svc.icon} />
              </div>
              {/* 이름 */}
              <h3 className="mb-1">
                <BrandText brand={svc.id} size="text-lg" />
              </h3>
              {/* 카테고리 */}
              <p className="text-[11px] tracking-wide text-[#5C5C7A] dark:text-[#6A5490] uppercase mb-3">
                {svc.category}
              </p>
              {/* 설명 */}
              <p className="text-sm text-[#4A4270] dark:text-[#7A6A9A] leading-relaxed mb-4">
                {svc.description}
              </p>
              {/* 상태 배지 */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full bg-brand/[0.06] dark:bg-white/[0.04]">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: svc.status === 'coming_soon' ? EMERALD : AMBER,
                  }}
                />
                <span className="text-[#4A4270] dark:text-[#8A7AAA]">
                  {UPCOMING_STATUS_LABELS[svc.status]}
                </span>
              </span>
            </div>
          ))}
        </div>
        )}

        {/* 알림 신청 바 */}
        <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-accent-gold/[0.04] dark:bg-accent-gold/[0.04] border border-accent-gold/10 flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <span className="text-accent-gold" aria-hidden="true"><BellIcon size={28} /></span>
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-medium text-[#1A1A2E] dark:text-white/90 mb-1">
              출시 알림을 받아보세요
            </p>
            <p className="text-xs text-[#5C5C7A] dark:text-[#6A5490]">
              회원가입하시면 새로운 서비스 출시 소식을 가장 먼저 받아보실 수 있습니다
            </p>
          </div>
          <Link to="/auth/register">
            <button className="inline-flex items-center justify-center px-6 py-2.5 text-sm rounded-xl min-h-[44px] font-medium transition-all duration-300 bg-gradient-to-r from-brand to-purple-500 text-white shadow-[0_4px_20px_rgba(124,58,237,0.2)] dark:shadow-[0_0_24px_rgba(124,58,237,0.25)] hover:from-brand-600 hover:to-purple-600">
              ✦ 알림 신청하기
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
