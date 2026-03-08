/**
 * @file 공유 아이콘 라이브러리 배럴 export — RPG 판타지 테마
 * @module @pompcore/ui/icons
 *
 * @example
 * import { VaultIcon, IconCheck, GoogleIcon } from '@pompcore/ui';
 */

// Types & helpers
export type { IconProps } from './types';
export { svgDefaults } from './types';

// Platform service icons
export { VaultIcon, QuestIcon, AcademyIcon, ForgeIcon, PompCoreIcon } from './PlatformIcons';

// Common utility icons
export {
  // 방향/네비게이션
  IconArrowUp, IconArrowDown, IconArrowLeft, IconChevronRight,
  // 액션/상태
  IconPlus, IconCheck, IconClose, IconSearch, IconFilter,
  // 커뮤니케이션
  IconBell, IconMegaphone, IconChat,
  // 사용자/계정
  IconUser, IconUsers,
  // 시스템/UI
  IconSettings, IconTrash, IconDocument, IconTag, IconSliders, IconTransfer,
  IconHome, IconPhone, IconDevice, IconPuzzle, IconProtect, IconCelebration, IconWrench,
  IconPalette, IconCode,
  // 감정/피드백
  IconHeartFilled, IconHeartOutline, IconSparkle,
  // 기타
  IconLink, IconShield, IconKey, IconTarget, IconRocket, IconTrendUp, IconClipboard,
  IconRepeat,
  // 금융/Vault 도메인
  IconCoin, IconBank, IconReceipt, IconGem, IconWallet, IconChart,
  IconUtensils, IconBus, IconCart, IconHouse, IconSmartphone, IconMedical,
  IconFilm, IconBook, IconCoffee, IconGamepad, IconPlane, IconGift,
  IconBanknote, IconPiggyBank, IconInvestment, IconRealEstate,
} from './CommonIcons';

// Social/external service icons
export { GoogleIcon, GitHubIcon, DiscordIcon } from './SocialIcons';
