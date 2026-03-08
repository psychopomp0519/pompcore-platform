/**
 * FAQ 데이터
 * - FaqSection에서 아코디언 UI로 렌더링
 * - 새 질문 추가 시 이 배열에 항목 추가
 * - JSON-LD(FAQPage schema) 구조화 데이터 호환 구조
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'PompCore가 뭔가요?',
    answer:
      'PompCore는 가계부(Vault), 일정 관리(Quest) 등 일상에 필요한 서비스를 하나의 플랫폼에서 제공하는 통합 라이프스타일 서비스입니다.',
  },
  {
    question: '무료인가요?',
    answer:
      '네, 모든 필수 기능은 무료입니다. 고급 분석, 커스텀 테마 등 부가 기능에만 선택적으로 프리미엄 요금이 적용될 예정입니다.',
  },
  {
    question: '내 데이터는 안전한가요?',
    answer:
      '모든 개인 데이터는 암호화되어 저장됩니다. 제3자에게 데이터를 판매하거나 공유하지 않습니다.',
  },
  {
    question: '모바일에서도 사용할 수 있나요?',
    answer:
      '네, 웹 기반이므로 모바일 브라우저에서 바로 사용 가능합니다. 향후 PWA 지원을 통해 앱처럼 설치하여 사용할 수도 있습니다.',
  },
  {
    question: '서비스는 언제 출시되나요?',
    answer:
      '현재 핵심 서비스를 준비하고 있으며, 회원가입 시 출시 알림을 받으실 수 있습니다.',
  },
];
