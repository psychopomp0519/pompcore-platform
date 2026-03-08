/**
 * 홈 페이지 (랜딩 페이지)
 * - fullPage.js 스타일 풀스크린 섹션 스크롤
 * - 우측 네비게이션 인디케이터 (섹션 점)
 * - CSS scroll-snap 기반 (라이브러리 미사용)
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import WhySection from './WhySection';
import UpcomingSection from './UpcomingSection';
import FaqSection from './FaqSection';
import CtaBanner from './CtaBanner';

/** 섹션 메타 (인디케이터 라벨) */
const SECTIONS = [
  { id: 'hero', label: '홈' },
  { id: 'services', label: '서비스' },
  { id: 'why', label: '특징' },
  { id: 'upcoming', label: '예정' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: '시작' },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /** 스크롤 위치로 현재 섹션 감지 */
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const sectionHeight = container.clientHeight;
    const index = Math.round(scrollTop / sectionHeight);
    setActiveIndex(Math.min(index, SECTIONS.length - 1));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /** 인디케이터 클릭으로 섹션 이동 */
  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: index * container.clientHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fullpage-wrapper">
      {/* 스크롤 컨테이너 */}
      <div ref={containerRef} className="fullpage-container">
        <HeroSection />
        <ServicesSection />
        <WhySection />
        <UpcomingSection />
        <FaqSection />
        <CtaBanner />
      </div>

      {/* 우측 네비게이션 인디케이터 */}
      <nav
        className="fullpage-nav"
        aria-label="섹션 네비게이션"
      >
        {SECTIONS.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`fullpage-dot ${activeIndex === index ? 'active' : ''}`}
            aria-label={section.label}
            aria-current={activeIndex === index ? 'true' : undefined}
          >
            <span className="fullpage-dot-inner" />
            <span className="fullpage-dot-label">{section.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
