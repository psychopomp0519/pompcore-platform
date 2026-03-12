/**
 * WhySection — 왜 PompCore인가요?
 * - 기존 FeaturesSection의 FEATURES 데이터 재사용
 * - Nebula 팔레트로 스타일 리디자인, SVG 아이콘 사용
 */
import { KeyIcon, DeviceIcon, ShieldIcon, PuzzleIcon } from '../../components/icons/Icons';
import type { IconProps } from '../../components/icons/Icons';
import CloudBackground from '../../components/common/CloudBackground';
import type { CloudConfig } from '../../components/common/CloudBackground';
import Starfield from '../../components/common/Starfield';

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

/** 구름 배경 설정 (라이트 모드 전용) */
const CLOUDS: CloudConfig[] = [
  {
    type: 'composite',
    position: 'top-[10%] right-[6%]',
    outerSize: 'w-[190px] md:w-[320px] h-[55px] md:h-[80px]',
    innerSize: 'w-[130px] md:w-[230px] h-[38px] md:h-[58px]',
    outerBlur: 'blur-[25px]',
    innerBlur: 'blur-[11px]',
    outerOpacity: 'bg-white/40',
    innerOpacity: 'bg-white/[0.76]',
    animation: 'animate-cloud-drift',
    delay: '4s',
  },
  {
    type: 'composite',
    position: 'bottom-[12%] left-[18%]',
    outerSize: 'w-[170px] md:w-[280px] h-[50px] md:h-[72px]',
    innerSize: 'w-[120px] md:w-[200px] h-[35px] md:h-[52px]',
    outerBlur: 'blur-[24px]',
    innerBlur: 'blur-[10px]',
    outerOpacity: 'bg-white/[0.38]',
    innerOpacity: 'bg-white/[0.74]',
    animation: 'animate-cloud-drift-slow',
    delay: '11s',
  },
  {
    type: 'simple',
    position: 'top-[35%] left-[5%]',
    size: 'w-[100px] md:w-[160px] h-[32px] md:h-[46px]',
    blur: 'blur-[8px]',
    opacity: 'bg-white/80',
    animation: 'animate-cloud-drift',
    delay: '7s',
  },
  {
    type: 'simple',
    position: 'bottom-[30%] right-[20%]',
    size: 'w-[85px] md:w-[140px] h-[28px] md:h-[42px]',
    blur: 'blur-[7px]',
    opacity: 'bg-white/[0.78]',
    animation: 'animate-cloud-drift-slow',
    delay: '16s',
  },
];

export default function WhySection() {
  return (
    <section className="snap-section bg-gradient-to-b from-sky-mist to-sky-soft dark:from-surface-dark-1 dark:to-surface-dark-1 relative overflow-hidden py-12 flex flex-col justify-center">
      {/* 배경 글로우 */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[5%] w-[250px] md:w-[350px] lg:w-[400px] h-[250px] md:h-[350px] lg:h-[400px] bg-sky-mid/[0.12] dark:bg-brand/[0.04] rounded-full blur-[120px] pointer-events-none" />
      {/* 구름 (라이트 전용) */}
      <CloudBackground clouds={CLOUDS} />
      {/* 별 (다크 전용) */}
      <Starfield count={10} spreadY={9.1} spreadX={9.7} baseOpacity={0.25} delayStep={0.33} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-display text-2xl sm:text-[28px] font-bold text-[#1A1A2E] dark:text-white mb-3">
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
                bg-brand/[0.03] border border-brand/[0.08]
                dark:bg-brand/[0.03] dark:border-brand/[0.08]
                hover:border-brand/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] hover:bg-brand/[0.05]
                transition-all duration-300
              "
            >
              {/* 아이콘 */}
              <div className="w-12 h-12 rounded-[14px] bg-brand/[0.08] shadow-sm flex items-center justify-center text-brand dark:text-purple-400 mb-4">
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
