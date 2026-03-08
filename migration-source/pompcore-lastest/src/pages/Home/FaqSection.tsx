/**
 * FAQ 섹션 — 자주 묻는 질문
 * - constants/faq.ts 데이터 기반 아코디언 UI
 * - aria-expanded 접근성 지원
 * - JSON-LD(FAQPage schema) 호환 데이터 구조
 */
import { useState } from 'react';
import { FAQ_ITEMS } from '../../constants/faq';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="snap-section bg-gradient-to-b from-sky-mist to-sky-faint dark:from-surface-dark-1 dark:to-surface-dark-1 relative overflow-hidden py-12 flex flex-col justify-center">
      {/* 구름 (라이트 전용) — 복합 구름 + 애니메이션 */}
      <div className="dark:hidden absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* 복합 구름 1 */}
        <div className="animate-cloud-drift-slow" style={{ animationDelay: '5s' }}>
          <div className="absolute top-[8%] right-[10%] w-[180px] md:w-[300px] h-[52px] md:h-[76px] bg-white/40 rounded-full blur-[24px]" />
          <div className="absolute top-[8.5%] right-[12%] w-[120px] md:w-[210px] h-[36px] md:h-[54px] bg-white/76 rounded-full blur-[10px]" />
        </div>
        {/* 복합 구름 2 */}
        <div className="animate-cloud-drift" style={{ animationDelay: '12s' }}>
          <div className="absolute bottom-[12%] left-[6%] w-[160px] md:w-[270px] h-[48px] md:h-[68px] bg-white/38 rounded-full blur-[22px]" />
          <div className="absolute bottom-[12.5%] left-[8%] w-[110px] md:w-[190px] h-[34px] md:h-[48px] bg-white/74 rounded-full blur-[9px]" />
        </div>
        {/* 작은 구름 */}
        <div className="animate-cloud-drift" style={{ animationDelay: '8s' }}>
          <div className="absolute top-[40%] left-[15%] w-[85px] md:w-[140px] h-[28px] md:h-[42px] bg-white/78 rounded-full blur-[7px]" />
        </div>
        <div className="animate-cloud-drift-slow" style={{ animationDelay: '17s' }}>
          <div className="absolute bottom-[35%] right-[18%] w-[80px] md:w-[130px] h-[26px] md:h-[38px] bg-white/76 rounded-full blur-[7px]" />
        </div>
      </div>
      {/* 별 (다크 전용) */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle" style={{ top: `${8 + (i * 10.5) % 82}%`, left: `${6 + (i * 11.3) % 87}%`, animationDelay: `${(i * 0.35).toFixed(2)}s`, opacity: 0.2 + (i % 3) * 0.15 }} />
        ))}
      </div>
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h2 className="font-display text-xl sm:text-[28px] font-bold text-[#1A1A2E] dark:text-white mb-3">
            자주 묻는 <span className="text-gradient">질문</span>
          </h2>
          <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">
            궁금한 점이 있으신가요?
          </p>
        </div>

        {/* 아코디언 */}
        {FAQ_ITEMS.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-[#5C5C7A] dark:text-[#6A5490]">등록된 FAQ가 없습니다.</p>
          </div>
        ) : (
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-[#7C3AED]/[0.025] dark:bg-[#7C3AED]/[0.025] border border-[#7C3AED]/[0.07] dark:border-[#7C3AED]/[0.07] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-3 p-4 text-left min-h-[44px] cursor-pointer"
                >
                  {/* Q 아이콘 */}
                  <span className="font-display text-sm font-bold text-[#B8860B] dark:text-[#FFD700]/70 shrink-0">
                    Q
                  </span>
                  {/* 질문 텍스트 */}
                  <span className="flex-1 text-sm text-[#1A1A2E] dark:text-[#E0D8F0]">
                    {item.question}
                  </span>
                  {/* 화살표 */}
                  <span
                    className={`text-xs text-[#7C3AED]/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>

                {/* 답변 — grid-rows 트랜지션으로 부드럽게 열고 닫기 */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 pl-10">
                      <p className="text-[13px] text-[#5C5C7A] dark:text-[#7A6A9A] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
