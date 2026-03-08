/**
 * WhySection — 왜 PompCore인가요?
 * - 기존 FeaturesSection의 FEATURES 데이터 재사용
 * - Nebula 팔레트로 스타일 리디자인, SVG 아이콘 사용
 */
import { KeyIcon, DeviceIcon, ShieldIcon, PuzzleIcon } from '../../components/icons/Icons';
import type { IconProps } from '../../components/icons/Icons';

/** 특징 데이터 (기존 FeaturesSection에서 이관) */
const FEATURES: { IconComponent: React.ComponentType<IconProps>; title: string; description: string }[] = [
  {
    IconComponent: KeyIcon,
    title: '하나의 계정, 모든 서비스',
    description:
      'PompCore 계정 하나로 모든 프로젝트에 로그인하세요. 별도 가입 없이 바로 시작할 수 있습니다.',
  },
  {
    IconComponent: DeviceIcon,
    title: '웹과 모바일, 어디서든',
    description:
      '웹사이트와 모바일 앱 모두 지원합니다. 장소에 상관없이 일상을 관리하세요.',
  },
  {
    IconComponent: ShieldIcon,
    title: '안전한 데이터 보호',
    description:
      '개인 정보와 데이터는 철저히 암호화하여 보호합니다. 안심하고 사용하세요.',
  },
  {
    IconComponent: PuzzleIcon,
    title: '연결되는 서비스들',
    description:
      '가계부, 일정 관리 등 각 서비스가 유기적으로 연결되어 더 스마트한 경험을 제공합니다.',
  },
];

export default function WhySection() {
  return (
    <section className="snap-section bg-gradient-to-b from-sky-mist to-sky-soft dark:from-surface-dark-1 dark:to-surface-dark-1 relative overflow-hidden py-12 flex flex-col justify-center">
      {/* 배경 글로우 */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[5%] w-[250px] md:w-[350px] lg:w-[400px] h-[250px] md:h-[350px] lg:h-[400px] bg-sky-mid/[0.12] dark:bg-[#7C3AED]/[0.04] rounded-full blur-[120px] pointer-events-none" />
      {/* 구름 (라이트 전용) — 복합 구름 + 애니메이션 */}
      <div className="dark:hidden absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* 복합 구름 1 */}
        <div className="animate-cloud-drift" style={{ animationDelay: '4s' }}>
          <div className="absolute top-[10%] right-[6%] w-[190px] md:w-[320px] h-[55px] md:h-[80px] bg-white/40 rounded-full blur-[25px]" />
          <div className="absolute top-[10.5%] right-[8%] w-[130px] md:w-[230px] h-[38px] md:h-[58px] bg-white/76 rounded-full blur-[11px]" />
        </div>
        {/* 복합 구름 2 */}
        <div className="animate-cloud-drift-slow" style={{ animationDelay: '11s' }}>
          <div className="absolute bottom-[12%] left-[18%] w-[170px] md:w-[280px] h-[50px] md:h-[72px] bg-white/38 rounded-full blur-[24px]" />
          <div className="absolute bottom-[12.5%] left-[20%] w-[120px] md:w-[200px] h-[35px] md:h-[52px] bg-white/74 rounded-full blur-[10px]" />
        </div>
        {/* 작은 구름 */}
        <div className="animate-cloud-drift" style={{ animationDelay: '7s' }}>
          <div className="absolute top-[35%] left-[5%] w-[100px] md:w-[160px] h-[32px] md:h-[46px] bg-white/80 rounded-full blur-[8px]" />
        </div>
        <div className="animate-cloud-drift-slow" style={{ animationDelay: '16s' }}>
          <div className="absolute bottom-[30%] right-[20%] w-[85px] md:w-[140px] h-[28px] md:h-[42px] bg-white/78 rounded-full blur-[7px]" />
        </div>
      </div>
      {/* 별 (다크 전용) */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ top: `${6 + (i * 9.1) % 86}%`, left: `${4 + (i * 9.7) % 91}%`, animationDelay: `${(i * 0.33).toFixed(2)}s`, opacity: 0.25 + (i % 3) * 0.15 }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-display text-xl sm:text-[28px] font-bold text-[#1A1A2E] dark:text-white mb-3">
            왜 <span className="text-gradient">PompCore</span>인가요?
          </h2>
          <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">
            하나의 플랫폼에서 일상의 모든 것을 관리하세요
          </p>
        </div>

        {/* 4열 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="
                rounded-2xl p-5 sm:p-8
                bg-[#7C3AED]/[0.03] border border-[#7C3AED]/[0.08]
                dark:bg-[#7C3AED]/[0.03] dark:border-[#7C3AED]/[0.08]
                hover:border-[#7C3AED]/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] hover:bg-[#7C3AED]/[0.05]
                transition-all duration-300
              "
            >
              {/* 아이콘 */}
              <div className="w-12 h-12 rounded-[14px] bg-[#7C3AED]/[0.08] shadow-sm flex items-center justify-center text-[#7C3AED] dark:text-[#A78BFA] mb-4">
                <feature.IconComponent size={24} />
              </div>
              {/* 제목 */}
              <h3 className="text-base font-semibold text-[#1A1A2E] dark:text-[#E8E0F0] mb-2">
                {feature.title}
              </h3>
              {/* 설명 */}
              <p className="text-sm text-[#5C5C7A] dark:text-[#4A4270] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
