/**
 * Hero 섹션 컴포넌트
 * - 랜딩 페이지 최상단 메인 비주얼 영역
 * - 의식형(Ceremonial) 스타일 — 판타지 RPG 분위기
 * - 배경 글로우, 별 파티클(다크), 장식 프레임, 엠블럼, 서비스 미니 카드
 */
import { Link } from 'react-router-dom';
import { Button } from '@pompcore/ui';
import { VaultIcon, QuestIcon } from '../../components/icons/Icons';
import { BRAND, EMERALD } from '../../constants/colors';
import BrandText from '../../components/common/BrandText';
import CloudBackground from '../../components/common/CloudBackground';
import type { CloudConfig } from '../../components/common/CloudBackground';
import type { IconProps } from '../../components/icons/Icons';

/** 히어로 내 서비스 미니 카드 데이터 */
const HERO_SERVICES: { brandKey: 'vault' | 'quest'; name: string; IconComponent: React.ComponentType<IconProps>; desc: string; borderColor: string; stats: { label: string; value: number }[] }[] = [
  {
    brandKey: 'vault',
    name: 'Vault',
    IconComponent: VaultIcon,
    desc: '스마트 가계부',
    borderColor: EMERALD,
    stats: [
      { label: '편의성', value: 85 },
      { label: '분석력', value: 92 },
    ],
  },
  {
    brandKey: 'quest',
    name: 'Quest',
    IconComponent: QuestIcon,
    desc: '일정 관리',
    borderColor: BRAND,
    stats: [
      { label: '몰입도', value: 90 },
      { label: '성장', value: 88 },
    ],
  },
];

/** 히어로 섹션 구름 배치 데이터 */
const HERO_CLOUDS: CloudConfig[] = [
  {
    type: 'composite',
    position: 'top-[6%] left-[8%]',
    outerSize: 'w-[220px] md:w-[380px] h-[60px] md:h-[90px]',
    innerSize: 'w-[160px] md:w-[280px] h-[45px] md:h-[65px]',
    outerBlur: 'blur-[28px]',
    innerBlur: 'blur-[12px]',
    outerOpacity: 'bg-white/45',
    innerOpacity: 'bg-white/80',
    animation: 'animate-cloud-drift',
    delay: '0s',
  },
  {
    type: 'composite',
    position: 'top-[11%] right-[6%]',
    outerSize: 'w-[240px] md:w-[400px] h-[65px] md:h-[100px]',
    innerSize: 'w-[170px] md:w-[300px] h-[48px] md:h-[72px]',
    outerBlur: 'blur-[30px]',
    innerBlur: 'blur-[14px]',
    outerOpacity: 'bg-white/40',
    innerOpacity: 'bg-white/78',
    animation: 'animate-cloud-drift-slow',
    delay: '3s',
  },
  {
    type: 'composite',
    position: 'top-[28%] left-[18%]',
    outerSize: 'w-[180px] md:w-[300px] h-[50px] md:h-[75px]',
    innerSize: 'w-[130px] md:w-[220px] h-[38px] md:h-[55px]',
    outerBlur: 'blur-[25px]',
    innerBlur: 'blur-[10px]',
    outerOpacity: 'bg-white/40',
    innerOpacity: 'bg-white/75',
    animation: 'animate-cloud-drift',
    delay: '7s',
  },
  {
    type: 'composite',
    position: 'top-[20%] right-[15%]',
    outerSize: 'w-[160px] md:w-[270px] h-[50px] md:h-[70px]',
    innerSize: 'w-[110px] md:w-[190px] h-[36px] md:h-[50px]',
    outerBlur: 'blur-[24px]',
    innerBlur: 'blur-[10px]',
    outerOpacity: 'bg-white/38',
    innerOpacity: 'bg-white/72',
    animation: 'animate-cloud-drift-slow',
    delay: '12s',
  },
  {
    type: 'composite',
    position: 'bottom-[20%] left-[12%]',
    outerSize: 'w-[200px] md:w-[350px] h-[55px] md:h-[85px]',
    innerSize: 'w-[140px] md:w-[250px] h-[40px] md:h-[60px]',
    outerBlur: 'blur-[26px]',
    innerBlur: 'blur-[12px]',
    outerOpacity: 'bg-white/42',
    innerOpacity: 'bg-white/76',
    animation: 'animate-cloud-drift',
    delay: '5s',
  },
  {
    type: 'simple',
    position: 'top-[7%] left-[35%]',
    size: 'w-[90px] md:w-[150px] h-[32px] md:h-[48px]',
    blur: 'blur-[8px]',
    opacity: 'bg-white/85',
    animation: 'animate-cloud-drift-slow',
    delay: '2s',
  },
  {
    type: 'simple',
    position: 'top-[24%] right-[28%]',
    size: 'w-[100px] md:w-[160px] h-[35px] md:h-[50px]',
    blur: 'blur-[8px]',
    opacity: 'bg-white/82',
    animation: 'animate-cloud-drift',
    delay: '9s',
  },
  {
    type: 'simple',
    position: 'bottom-[28%] left-[48%]',
    size: 'w-[80px] md:w-[130px] h-[28px] md:h-[42px]',
    blur: 'blur-[7px]',
    opacity: 'bg-white/80',
    animation: 'animate-cloud-drift-slow',
    delay: '15s',
  },
];

/** 별 파티클 인덱스 (렌더마다 재생성 방지) */
const SMALL_STARS = Array.from({ length: 25 }, (_, i) => i);
const MEDIUM_STARS = Array.from({ length: 12 }, (_, i) => i);
const BRIGHT_STARS = [
  { top: '8%', left: '15%' },
  { top: '20%', left: '78%' },
  { top: '45%', left: '92%' },
  { top: '65%', left: '8%' },
  { top: '80%', left: '55%' },
];

export default function HeroSection() {
  /** ServicesSection으로 스무스 스크롤 */
  const scrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="snap-section relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-light via-sky-pale to-sky-faint dark:from-surface-dark-1 dark:via-surface-dark-1 dark:to-surface-dark-1"
      aria-label="히어로 영역"
    >
      {/* === 배경 글로우 오브 (다크: 별밤 글로우 / 라이트: 하늘빛 글로우) === */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[600px] bg-[#87CEEB]/[0.12] dark:bg-brand/[0.07] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-[250px] md:w-[350px] lg:w-[400px] h-[250px] md:h-[350px] lg:h-[400px] bg-[#B0E0FF]/[0.08] dark:bg-accent-gold/[0.025] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[200px] md:w-[300px] lg:w-[350px] h-[200px] md:h-[300px] lg:h-[350px] bg-[#E0F0FF]/[0.15] dark:bg-accent-pink/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* === 구름 장식 (라이트 모드 전용) === */}
      <CloudBackground clouds={HERO_CLOUDS} />

      {/* === 별 파티클 (다크 모드 전용) — 다양한 크기 + 밝기 === */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* 작은 별 (2px) */}
        {SMALL_STARS.map((i) => (
          <span
            key={`s-${i}`}
            className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle"
            style={{
              top: `${3 + (i * 3.7) % 92}%`,
              left: `${2 + (i * 4.1) % 95}%`,
              animationDelay: `${(i * 0.17).toFixed(2)}s`,
              opacity: 0.2 + (i % 4) * 0.15,
            }}
          />
        ))}
        {/* 중간 별 (3px) */}
        {MEDIUM_STARS.map((i) => (
          <span
            key={`m-${i}`}
            className="absolute w-[3px] h-[3px] bg-white rounded-full animate-twinkle"
            style={{
              top: `${5 + (i * 8.3) % 88}%`,
              left: `${4 + (i * 7.9) % 92}%`,
              animationDelay: `${(i * 0.41).toFixed(2)}s`,
              opacity: 0.4 + (i % 3) * 0.2,
            }}
          />
        ))}
        {/* 밝은 큰 별 (4px, 글로우 효과) */}
        {BRIGHT_STARS.map((pos, i) => (
          <span
            key={`b-${i}`}
            className="absolute w-[4px] h-[4px] bg-white rounded-full animate-twinkle"
            style={{
              ...pos,
              animationDelay: `${(i * 0.8).toFixed(2)}s`,
              opacity: 0.8,
              boxShadow: '0 0 6px 2px rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>

      {/* === 장식 프레임 (4 코너 L자 + 상하 다이아몬드 + 가로 라인) === */}
      <div className="absolute inset-4 sm:inset-8 md:inset-16 pointer-events-none" aria-hidden="true">
        {/* 코너 L자 보더 */}
        <div className="absolute top-0 left-0 w-9 h-9 border-t-[1.5px] border-l-[1.5px] border-brand/[0.12] dark:border-brand/[0.12]" />
        <div className="absolute top-0 right-0 w-9 h-9 border-t-[1.5px] border-r-[1.5px] border-brand/[0.12] dark:border-brand/[0.12]" />
        <div className="absolute bottom-0 left-0 w-9 h-9 border-b-[1.5px] border-l-[1.5px] border-brand/[0.12] dark:border-brand/[0.12]" />
        <div className="absolute bottom-0 right-0 w-9 h-9 border-b-[1.5px] border-r-[1.5px] border-brand/[0.12] dark:border-brand/[0.12]" />

        {/* 상하 다이아몬드 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-brand/[0.15]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rotate-45 border border-brand/[0.15]" />

        {/* 가로 라인 (상단/하단) */}
        <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-brand/10 to-transparent" />
        <div className="absolute bottom-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-brand/10 to-transparent" />
      </div>

      {/* === 메인 콘텐츠 === */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-4 sm:gap-6 py-24 sm:py-32">

        {/* 엠블럼 */}
        <div
          className="w-16 h-16 rounded-full border border-brand/[0.18] bg-brand/[0.04] flex items-center justify-center dark:shadow-[0_0_30px_rgba(124,58,237,0.08)]"
          aria-hidden="true"
        >
          <span className="font-display-deco text-2xl font-bold bg-gradient-to-b from-[#C8A0FF] to-[#FFD700] bg-clip-text text-transparent">
            P
          </span>
        </div>

        {/* 타이틀 */}
        <h1 className="font-display font-black leading-tight sm:leading-tight">
          <span className="block text-[22px] sm:text-[34px] md:text-[42px] leading-[1.3] sm:leading-snug bg-gradient-to-r from-[#9B59B6] via-[#D4A017] to-[#E0598B] bg-clip-text text-transparent dark:from-[#E0C0FF] dark:via-[#FFD700] dark:to-[#FF90D0]">
            모험가여,
          </span>
          <span className="block text-[22px] sm:text-[34px] md:text-[42px] leading-[1.3] sm:leading-snug text-[#1A1A2E] dark:text-white mt-1.5 sm:mt-1">
            당신의 이야기를
          </span>
          <span className="block text-[20px] sm:text-[28px] md:text-[36px] leading-[1.3] sm:leading-snug text-[#1A1A2E]/70 dark:text-white/55 mt-1.5 sm:mt-1">
            여기서 시작하세요
          </span>
        </h1>

        {/* 골드 디바이더 */}
        <div
          className="w-[100px] h-[1px] bg-gradient-to-r from-transparent via-brand/20 to-transparent dark:via-accent-gold/30"
          aria-hidden="true"
        />

        {/* 슬로건 */}
        <p className="text-xs tracking-[3px] text-brand/60 dark:text-purple-400/50 uppercase font-medium">
          일상을 플레이하다 — Play Your Day
        </p>

        {/* 서브카피 */}
        <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490] max-w-md leading-relaxed">
          서브컬쳐 게임의 감성으로 일상을 관리하세요.
          <br />
          가계부, 일정 관리, 그리고 더 많은 모험이 기다립니다.
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link to="/auth/register">
            <Button variant="primary" size="md">
              ✦ 여정을 시작하다
            </Button>
          </Link>
          <button
            onClick={scrollToServices}
            className="inline-flex items-center justify-center px-6 py-2.5 text-base rounded-xl min-h-[44px] font-medium transition-all duration-300 bg-white border border-[#E0D8F0] text-brand hover:bg-brand-50 dark:bg-white/[0.03] dark:border-white/10 dark:text-[#A090C0] dark:hover:bg-white/[0.06]"
          >
            세계를 탐험하다
          </button>
        </div>

        {/* 서비스 미니 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 w-full max-w-[600px]">
          {HERO_SERVICES.map((svc) => (
            <div
              key={svc.name}
              className="rounded-xl p-4 bg-white/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] text-left"
              style={{ borderTopColor: svc.borderColor, borderTopWidth: '2px' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl" style={{ color: svc.borderColor }}><svc.IconComponent size={20} /></span>
                <div>
                  <BrandText brand={svc.brandKey} size="text-sm" />
                  <p className="text-[11px] text-[#5C5C7A] dark:text-[#6A5490]">{svc.desc}</p>
                </div>
              </div>
              {/* 스탯 바 */}
              <div className="space-y-1.5 mt-3">
                {svc.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-[#5C5C7A] dark:text-[#6A5490]">{stat.label}</span>
                      <span className="text-brand dark:text-purple-400 font-medium">{stat.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${stat.value}%`,
                          background: `linear-gradient(90deg, ${svc.borderColor}, ${svc.borderColor}88)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 스크롤 유도 */}
        <div className="flex flex-col items-center gap-2 mt-8" aria-hidden="true">
          <span className="text-[10px] tracking-[1.5px] text-[#6A5490] dark:text-[#6A5490] uppercase">
            DISCOVER
          </span>
          <span
            className="w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_rgba(124,58,237,0.4)] animate-scroll-pulse"
          />
        </div>
      </div>
    </section>
  );
}
