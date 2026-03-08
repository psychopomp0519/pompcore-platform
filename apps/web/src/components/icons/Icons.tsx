/**
 * SVG 아이콘 컴포넌트 모음
 * - 사이트 전체에서 이모지 대신 사용하는 커스텀 아이콘
 * - Nebula 테마에 어울리는 라인 스타일
 * - 모든 아이콘은 동일한 props 인터페이스 공유
 */
import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const defaultProps = (size: number = 24): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

/** 🔐 Vault — 자물쇠+방패 (금고 느낌) */
export function VaultIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 18v1" />
    </svg>
  );
}

/** ⚔️ Quest — 쌍검 (퀘스트/전투 느낌) */
export function QuestIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M5.5 21l3-3" />
      <path d="M9 18l-1.5-1.5" />
      <path d="M14.5 3.5L20 9l-10 10L5 14z" />
      <path d="M18.5 5.5l-3-3" />
      <path d="M14.5 3.5l6 6" />
      <path d="M3 21l3.5-3.5" />
    </svg>
  );
}

/** 📚 Academy — 책+별 (학습 느낌) */
export function AcademyIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z" />
      <path d="M12 7l1.5 3 3 .5-2.2 2 .6 3L12 14.5 9.1 16l.6-3-2.2-2 3-.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 🔑 하나의 계정 — 열쇠 */
export function KeyIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11.3 11.7L15 8" />
      <path d="M15 8l3 3" />
      <path d="M18 8l-3 3" />
      <path d="M15 8v3" />
    </svg>
  );
}

/** 📱 모바일/웹 — 디바이스 */
export function DeviceIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <rect x="2" y="3" width="12" height="18" rx="2" />
      <path d="M18 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" />
      <circle cx="8" cy="18" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 🔒 보안 — 방패+체크 */
export function ShieldIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** 🧩 연결 — 퍼즐 조각 */
export function PuzzleIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M20 17v-2a2 2 0 0 0-2-2h-1a1.5 1.5 0 0 1 0-3h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2a1.5 1.5 0 0 1-3 0H9a1.5 1.5 0 0 1-3 0H4a2 2 0 0 0-2 2v2a1.5 1.5 0 0 1 0 3v1a1.5 1.5 0 0 1 0 3v2a2 2 0 0 0 2 2h2a1.5 1.5 0 0 1 3 0h4a1.5 1.5 0 0 1 3 0h2a2 2 0 0 0 2-2z" />
    </svg>
  );
}

/** ✨ 스파크 — 반짝임 */
export function SparkleIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 🔔 알림 — 벨 */
export function BellIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

/** 🎯 목표 — 타겟 */
export function TargetIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 🔗 연결 — 링크 */
export function LinkIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/** 🛡️ 보호 — 방패 (심플) */
export function ProtectIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M12 2l8 4v5c0 5.25-3.5 9.74-8 11-4.5-1.26-8-5.75-8-11V6l8-4z" />
    </svg>
  );
}

/** 📢 공지 — 메가폰 */
export function MegaphoneIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M18 8a3 3 0 0 1 0 6" />
      <path d="M4 9v4a1 1 0 0 0 1 1h2l5 5V4L7 9H5a1 1 0 0 0-1 0z" />
    </svg>
  );
}

/** 🚀 로켓 */
export function RocketIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

/** 🎉 축하 — 파티 */
export function CelebrationIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M5.8 11.3L2 22l10.7-3.8" />
      <path d="M4 3h.01" />
      <path d="M22 8h.01" />
      <path d="M15 2h.01" />
      <path d="M22 20h.01" />
      <path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 1.96L17.05 7l2.24-.75a2.9 2.9 0 0 0 1.96-1.96z" />
      <path d="M9.1 14.9L5.8 11.3a.5.5 0 0 1 .1-.7l6.3-4.5a.5.5 0 0 1 .7.1l3.7 4.6a.5.5 0 0 1-.1.7l-6.3 4.5a.5.5 0 0 1-.7-.1z" />
    </svg>
  );
}

/** 🔧 도구 — 렌치 */
export function WrenchIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

/** 🎨 팔레트 — 디자이너 */
export function PaletteIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" stroke="none" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.24-.3-.39-.65-.39-1.04 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.17-4.49-9-10-9z" />
    </svg>
  );
}

/** 📋 클립보드 — 기획자/PM */
export function ClipboardIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
    </svg>
  );
}

/** 💻 코드 — 프론트엔드 개발 */
export function CodeIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

/** Google 로고 (멀티컬러) */
export function GoogleIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.99 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/**
 * 동적 아이콘 렌더러 — ICON_MAP에서 아이콘을 찾아 렌더링
 * - IIFE 패턴 제거를 위한 공통 컴포넌트
 * - 매핑 실패 시 fallback(이모지 등)을 텍스트로 표시
 */
export function DynamicIcon({ name, size = 24, fallback, ...props }: IconProps & { name: string; fallback?: string }) {
  const Icon = ICON_MAP[name];
  if (Icon) return <Icon size={size} {...props} />;
  return <span className="text-2xl">{fallback ?? name}</span>;
}

/** 아이콘 이름 → 컴포넌트 매핑 (동적 렌더링용) */
export const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  vault: VaultIcon,
  quest: QuestIcon,
  academy: AcademyIcon,
  key: KeyIcon,
  device: DeviceIcon,
  shield: ShieldIcon,
  puzzle: PuzzleIcon,
  sparkle: SparkleIcon,
  bell: BellIcon,
  target: TargetIcon,
  link: LinkIcon,
  protect: ProtectIcon,
  megaphone: MegaphoneIcon,
  rocket: RocketIcon,
  celebration: CelebrationIcon,
  wrench: WrenchIcon,
  palette: PaletteIcon,
  clipboard: ClipboardIcon,
  code: CodeIcon,
};
