/**
 * @file Web 앱 아이콘 — @pompcore/ui 공유 아이콘 re-export + 앱 전용 유틸리티
 * @description 공유 라이브러리에서 아이콘을 가져와 사용. DynamicIcon과 ICON_MAP은 Web 전용.
 */
import type { ReactNode } from 'react';
import type { IconProps } from '@pompcore/ui';

// 공유 아이콘 re-export (새 이름 + 하위 호환 별칭)
export {
  type IconProps,
  VaultIcon, QuestIcon, AcademyIcon, ForgeIcon, PompCoreIcon,
  IconKey, IconDevice, IconShield, IconPuzzle, IconSparkle, IconBell,
  IconTarget, IconLink, IconProtect, IconMegaphone, IconRocket,
  IconCelebration, IconWrench, IconPalette, IconClipboard, IconCode,
  GoogleIcon,
} from '@pompcore/ui';

// Re-import for aliases + ICON_MAP
import {
  VaultIcon, QuestIcon, AcademyIcon,
  IconKey, IconDevice, IconShield, IconPuzzle, IconSparkle, IconBell,
  IconTarget, IconLink, IconProtect, IconMegaphone, IconRocket,
  IconCelebration, IconWrench, IconPalette, IconClipboard, IconCode,
} from '@pompcore/ui';

// ============================================================
// 하위 호환 별칭 (기존 코드에서 사용하는 이름)
// ============================================================
export const KeyIcon = IconKey;
export const DeviceIcon = IconDevice;
export const ShieldIcon = IconShield;
export const PuzzleIcon = IconPuzzle;
export const SparkleIcon = IconSparkle;
export const BellIcon = IconBell;
export const TargetIcon = IconTarget;
export const LinkIcon = IconLink;
export const ProtectIcon = IconProtect;
export const MegaphoneIcon = IconMegaphone;
export const RocketIcon = IconRocket;
export const CelebrationIcon = IconCelebration;
export const WrenchIcon = IconWrench;
export const PaletteIcon = IconPalette;
export const ClipboardIcon = IconClipboard;
export const CodeIcon = IconCode;

// ============================================================
// Web 전용 유틸리티
// ============================================================

/**
 * 동적 아이콘 렌더러 — ICON_MAP에서 아이콘을 찾아 렌더링
 * - 매핑 실패 시 fallback(이모지 등)을 텍스트로 표시
 */
export function DynamicIcon({ name, size = 24, fallback, ...props }: IconProps & { name: string; fallback?: string }): ReactNode {
  const Icon = ICON_MAP[name];
  if (Icon) return <Icon size={size} {...props} />;
  return <span className="text-2xl">{fallback ?? name}</span>;
}

/** 아이콘 이름 → 컴포넌트 매핑 (동적 렌더링용) */
export const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  vault: VaultIcon,
  quest: QuestIcon,
  academy: AcademyIcon,
  key: IconKey,
  device: IconDevice,
  shield: IconShield,
  puzzle: IconPuzzle,
  sparkle: IconSparkle,
  bell: IconBell,
  target: IconTarget,
  link: IconLink,
  protect: IconProtect,
  megaphone: IconMegaphone,
  rocket: IconRocket,
  celebration: IconCelebration,
  wrench: IconWrench,
  palette: IconPalette,
  clipboard: IconClipboard,
  code: IconCode,
};
