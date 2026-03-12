/**
 * FAQ 섹션 — 자주 묻는 질문
 * - constants/faq.ts 데이터 기반 아코디언 UI
 * - aria-expanded 접근성 지원
 * - JSON-LD(FAQPage schema) 호환 데이터 구조
 */
import { useState } from 'react';
import { AdUnit } from '@pompcore/ui';
import { FAQ_ITEMS } from '../../constants/faq';
import CloudBackground from '../../components/common/CloudBackground';
import type { CloudConfig } from '../../components/common/CloudBackground';
import Starfield from '../../components/common/Starfield';

/** FAQ 섹션 구름 배치 데이터 */
const FAQ_CLOUDS: CloudConfig[] = [
  {
    type: 'composite',
    position: 'top-[8%] right-[10%]',
    outerSize: 'w-[180px] md:w-[300px] h-[52px] md:h-[76px]',
    innerSize: 'w-[120px] md:w-[210px] h-[36px] md:h-[54px]',
    outerBlur: 'blur-[24px]',
    innerBlur: 'blur-[10px]',
    outerOpacity: 'bg-white/40',
    innerOpacity: 'bg-white/76',
    animation: 'animate-cloud-drift-slow',
    delay: '5s',
  },
  {
    type: 'composite',
    position: 'bottom-[12%] left-[6%]',
    outerSize: 'w-[160px] md:w-[270px] h-[48px] md:h-[68px]',
    innerSize: 'w-[110px] md:w-[190px] h-[34px] md:h-[48px]',
    outerBlur: 'blur-[22px]',
    innerBlur: 'blur-[9px]',
    outerOpacity: 'bg-white/38',
    innerOpacity: 'bg-white/74',
    animation: 'animate-cloud-drift',
    delay: '12s',
  },
  {
    type: 'simple',
    position: 'top-[40%] left-[15%]',
    size: 'w-[85px] md:w-[140px] h-[28px] md:h-[42px]',
    blur: 'blur-[7px]',
    opacity: 'bg-white/78',
    animation: 'animate-cloud-drift',
    delay: '8s',
  },
  {
    type: 'simple',
    position: 'bottom-[35%] right-[18%]',
    size: 'w-[80px] md:w-[130px] h-[26px] md:h-[38px]',
    blur: 'blur-[7px]',
    opacity: 'bg-white/76',
    animation: 'animate-cloud-drift-slow',
    delay: '17s',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="snap-section bg-gradient-to-b from-sky-mist to-sky-faint dark:from-surface-dark-1 dark:to-surface-dark-1 relative overflow-hidden py-12 flex flex-col justify-center">
      {/* 구름 (라이트 전용) */}
      <CloudBackground clouds={FAQ_CLOUDS} />
      {/* 별 (다크 전용) */}
      <Starfield count={8} spreadY={10.5} spreadX={11.3} delayStep={0.35} />
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
                className="rounded-xl bg-brand/[0.025] dark:bg-brand/[0.025] border border-brand/[0.07] dark:border-brand/[0.07] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-3 p-4 text-left min-h-[44px] cursor-pointer"
                >
                  {/* Q 아이콘 */}
                  <span className="font-display text-sm font-bold text-[#B8860B] dark:text-accent-gold/70 shrink-0">
                    Q
                  </span>
                  {/* 질문 텍스트 */}
                  <span className="flex-1 text-sm text-[#1A1A2E] dark:text-[#E0D8F0]">
                    {item.question}
                  </span>
                  {/* 화살표 */}
                  <span
                    className={`text-xs text-brand/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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

        {/* 광고 — FAQ 하단 */}
        <AdUnit slot="FAQ_BOTTOM" format="horizontal" className="mt-8" />
      </div>
    </section>
  );
}
