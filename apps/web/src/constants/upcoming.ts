/**
 * 출시 예정 서비스 데이터
 * - UpcomingSection에서 자동 렌더링
 * - 새 서비스 추가 시 이 배열에 항목 추가
 */

export interface UpcomingService {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  status: 'coming_soon' | 'preparing';
  accentColor: string;
}

export const UPCOMING_SERVICES: UpcomingService[] = [
  {
    id: 'academy',
    name: 'Academy',
    icon: 'academy',
    category: '지식의 길드홀',
    description: '교사-학생 매칭, 수업 일정(Quest 연동), 수업료 관리(Vault 연동)를 하나의 생태계에서 제공하는 지식의 길드홀입니다',
    status: 'preparing',
    accentColor: '#FBBF24',
  },
];

/** 서비스 상태 라벨 */
export const UPCOMING_STATUS_LABELS: Record<string, string> = {
  coming_soon: '곧 출시',
  preparing: '준비 중',
};
