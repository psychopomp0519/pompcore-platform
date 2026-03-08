/**
 * 브랜드 로고 컴포넌트
 * - PompCore, Vault, Quest 등 서비스 이름을 SVG 로고로 렌더링
 * - 사이트 전체에서 일관된 브랜드 표현 유지
 */
import pompcoreLogo from '../../assets/logos/pompcore.svg';
import vaultLogo from '../../assets/logos/vault.svg';
import questLogo from '../../assets/logos/quest.svg';

interface BrandTextProps {
  /** 렌더링할 브랜드 이름 (등록된 키 또는 확장 가능한 string) */
  brand: 'pompcore' | 'vault' | 'quest' | 'academy' | (string & {});
  /** 텍스트 크기 (Tailwind text-* 클래스) — 로고 높이 결정에 사용 */
  size?: string;
  /** 추가 클래스 */
  className?: string;
}

/** 브랜드별 로고 및 폴백 텍스트 설정 */
const BRAND_CONFIG: Record<string, { logo?: string; label: string; textStyle: string }> = {
  pompcore: {
    logo: pompcoreLogo,
    label: 'POMPCORE',
    textStyle: 'bg-gradient-to-r from-[#C8A0FF] via-[#FFD700] to-[#FF90D0] bg-clip-text text-transparent',
  },
  vault: {
    logo: vaultLogo,
    label: 'VAULT',
    textStyle: 'text-[#10B981] dark:text-[#34D399]',
  },
  quest: {
    logo: questLogo,
    label: 'QUEST',
    textStyle: 'text-[#7C3AED] dark:text-[#C084FC]',
  },
  academy: {
    label: 'ACADEMY',
    textStyle: 'text-[#FBBF24] dark:text-[#FCD34D]',
  },
};

/** size 클래스 → 로고 높이(px) 매핑 */
const SIZE_TO_HEIGHT: Record<string, number> = {
  'text-xs': 8,
  'text-sm': 11,
  'text-base': 14,
  'text-lg': 16,
  'text-xl': 19,
  'text-2xl': 24,
  'text-3xl': 30,
};

export default function BrandText({ brand, size = 'text-lg', className = '' }: BrandTextProps) {
  const config = BRAND_CONFIG[brand] ?? BRAND_CONFIG.pompcore;
  const height = SIZE_TO_HEIGHT[size] ?? 22;

  if (config.logo) {
    return (
      <img
        src={config.logo}
        alt={config.label}
        className={`inline-block dark:invert ${className}`}
        style={{ height: `${height}px`, width: 'auto' }}
      />
    );
  }

  // 로고 없는 브랜드는 텍스트 폴백
  return (
    <span
      className={`font-display font-bold tracking-wide ${size} ${config.textStyle} ${className}`}
    >
      {config.label}
    </span>
  );
}

/**
 * PompCore 로고 (Header 등에서 사용)
 */
export function PompCoreLogo({ size = 'text-xl', className = '' }: { size?: string; className?: string }) {
  const height = SIZE_TO_HEIGHT[size] ?? 30;
  return (
    <img
      src={pompcoreLogo}
      alt="POMPCORE"
      className={`inline-block dark:invert ${className}`}
      style={{ height: `${height}px`, width: 'auto' }}
    />
  );
}
