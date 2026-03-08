/**
 * 프로젝트 관련 타입 정의
 * - PompCore 산하 모든 서브 프로젝트의 데이터 구조
 * - 새 프로젝트 추가 시 ProjectStatus에 상태를 추가하고 constants/projects.ts에 데이터 추가
 */

/** 프로젝트 상태 */
export type ProjectStatus = 'active' | 'coming_soon' | 'beta' | 'maintenance';

/** 프로젝트 카테고리 */
export type ProjectCategory = 'finance' | 'productivity' | 'education' | 'lifestyle';

/** 프로젝트 능력치 (장식용 스탯 바) */
export interface ProjectStat {
  label: string;
  value: number;
}

/** 서브 프로젝트 정보 */
export interface Project {
  /** 고유 식별자 (영문 소문자, URL 슬러그로 사용) */
  id: string;
  /** 프로젝트 표시 이름 */
  name: string;
  /** 한줄 설명 */
  description: string;
  /** 상세 설명 */
  longDescription?: string;
  /** 프로젝트 아이콘 (이모지 또는 아이콘 컴포넌트명) */
  icon: string;
  /** 프로젝트 상태 */
  status: ProjectStatus;
  /** 카테고리 */
  category: ProjectCategory;
  /** 카테고리 라벨 (예: "FINANCE · 스마트 가계부") */
  categoryLabel?: string;
  /** 프로젝트 URL (외부 링크) */
  url?: string;
  /** 브랜드 컬러 (Tailwind 클래스) */
  accentColor: string;
  /** 브랜드 그라디언트 (Tailwind 클래스) */
  accentGradient: string;
  /** 브랜드 그라디언트 CSS 값 (인라인 스타일용) */
  accentGradientCSS?: string;
  /** 로고 SVG 경로 (없으면 icon 이모지 사용) */
  logoSrc?: string;
  /** 주요 기능 리스트 */
  features?: string[];
  /** 능력치 스탯 (장식용) */
  stats?: ProjectStat[];
}
