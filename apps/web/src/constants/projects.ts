/**
 * 프로젝트 상수 데이터
 * - 새 프로젝트 추가 시 이 배열에 항목을 추가하면 자동으로 UI에 반영됨
 * - url 필드에 실제 서비스 URL을 입력하면 프로젝트 카드에서 바로 연결
 */
import type { Project } from '@pompcore/types';
import vaultLogo from '../assets/logos/vaultlogo.svg';
import questLogo from '../assets/logos/questlogo.svg';
import { BRAND, BRAND_LIGHT, EMERALD, EMERALD_LIGHT } from './colors';

export const PROJECTS: Project[] = [
  {
    id: 'vault',
    name: 'Vault',
    description: '게임 감성으로 재정을 관리하고, 절약 목표를 달성하세요.',
    longDescription:
      '수입과 지출을 게임 감성으로 기록하고 분석하는 스마트 가계부. 예산 설정과 초과 알림, 시각적 리포트로 재정 상태를 파악하고, 절약 목표 달성 시 경험치와 배지를 획득하세요.',
    icon: 'vault',
    status: 'active',
    url: 'https://vault.pompcore.cc',
    category: 'finance',
    categoryLabel: 'FINANCE · 스마트 가계부',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    accentGradient: 'from-emerald-500 to-teal-500',
    accentGradientCSS: `linear-gradient(90deg, ${EMERALD}, ${EMERALD_LIGHT})`,
    logoSrc: vaultLogo,
    features: ['수입/지출 자동 분류', '월별 리포트 & 차트', '예산 설정 & 초과 알림', '절약 경험치 & 배지'],
    stats: [
      { label: '편의성', value: 85 },
      { label: '분석력', value: 92 },
      { label: '보안', value: 95 },
      { label: '확장성', value: 78 },
    ],
  },
  {
    id: 'quest',
    name: 'Quest',
    description: '할 일을 퀘스트처럼 클리어하고, 레벨업하세요.',
    longDescription:
      '할 일과 일정을 RPG 퀘스트처럼 관리하는 서비스. 일정 완료 시 경험치를 획득하고 레벨업하세요. 캘린더, 루틴 트래커(데일리 퀘스트), 리마인더를 한 곳에서 관리합니다.',
    icon: 'quest',
    status: 'coming_soon',
    category: 'productivity',
    categoryLabel: 'PRODUCTIVITY · 일정 관리',
    accentColor: 'text-blue-600 dark:text-blue-400',
    accentGradient: 'from-blue-500 to-cyan-500',
    accentGradientCSS: `linear-gradient(90deg, ${BRAND}, ${BRAND_LIGHT})`,
    logoSrc: questLogo,
    features: ['경험치 & 레벨업', '캘린더 통합', '루틴 트래커 (데일리 퀘스트)', '리마인더 & 알림'],
    stats: [
      { label: '몰입도', value: 90 },
      { label: '성장', value: 88 },
      { label: '관리', value: 82 },
      { label: '재미', value: 94 },
    ],
  },
];

/** 프로젝트 상태별 라벨 */
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  active: '서비스 중',
  coming_soon: '출시 예정',
  beta: '베타 테스트',
  maintenance: '점검 중',
};
