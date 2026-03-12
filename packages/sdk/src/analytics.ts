/**
 * @file analytics.ts
 * @description 분석 도구 (Clarity, GA4) 및 AdSense 초기화 유틸리티
 * @module @pompcore/sdk/analytics
 *
 * 환경변수 기반 조건부 활성화 — 값이 비어있으면 해당 서비스를 로드하지 않는다.
 *
 * 참고 문서:
 * - Clarity: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
 * - GA4 gtag.js: https://developers.google.com/tag-platform/gtagjs
 * - AdSense: https://support.google.com/adsense/answer/9274634
 */

// ============================================================
// 타입
// ============================================================

interface AnalyticsConfig {
  /** Microsoft Clarity 프로젝트 ID */
  clarityId?: string;
  /** Google Analytics 4 측정 ID (G-XXXXXXXXXX) */
  gaMeasurementId?: string;
  /** Google AdSense 게시자 ID (ca-pub-XXXXXXXXXXXXXXXX) */
  adsenseClient?: string;
}

// ============================================================
// 내부 유틸
// ============================================================

/** <head>에 <script> 태그를 동적으로 주입한다. */
function injectScript(src: string, attrs?: Record<string, string>): void {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      script.setAttribute(key, value);
    }
  }
  document.head.appendChild(script);
}

/** <head>에 인라인 <script>를 주입한다. */
function injectInlineScript(code: string): void {
  const script = document.createElement('script');
  script.textContent = code;
  document.head.appendChild(script);
}

// ============================================================
// Microsoft Clarity
// ============================================================

/**
 * Microsoft Clarity 트래킹 스크립트를 주입한다.
 * @see https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
 */
function initClarity(projectId: string): void {
  /* 공식 Clarity 수동 설치 스크립트 */
  const clarityScript = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","${projectId}");
  `;
  injectInlineScript(clarityScript);
}

// ============================================================
// Google Analytics 4
// ============================================================

/**
 * GA4 gtag.js 스크립트를 주입한다.
 * @see https://developers.google.com/tag-platform/gtagjs
 */
function initGA4(measurementId: string): void {
  /* gtag.js 라이브러리 로드 */
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);

  /* gtag 초기화 */
  const gtagInit = `
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments);}
    gtag('js',new Date());
    gtag('config','${measurementId}');
  `;
  injectInlineScript(gtagInit);
}

// ============================================================
// Google AdSense
// ============================================================

/**
 * AdSense 라이브러리 스크립트를 <head>에 주입한다.
 * index.html에 정적 <script>가 이미 존재하면 중복 주입을 건너뛴다.
 * @see https://support.google.com/adsense/answer/9274634
 */
function initAdSense(clientId: string): void {
  const alreadyLoaded = document.querySelector(
    `script[src*="adsbygoogle.js?client=${clientId}"]`,
  );
  if (alreadyLoaded) return;

  injectScript(
    `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`,
    { crossorigin: 'anonymous' },
  );
}

// ============================================================
// 공개 API
// ============================================================

/**
 * 분석 도구 및 AdSense를 초기화한다.
 * 환경변수에서 자동으로 값을 읽어 조건부 활성화한다.
 *
 * @example
 * ```ts
 * // main.tsx에서 앱 초기화 시 호출
 * initAnalytics();
 * ```
 */
export function initAnalytics(overrides?: AnalyticsConfig): void {
  const config: AnalyticsConfig = {
    clarityId: overrides?.clarityId ?? (import.meta.env.VITE_CLARITY_ID || ''),
    gaMeasurementId: overrides?.gaMeasurementId ?? (import.meta.env.VITE_GA_MEASUREMENT_ID || ''),
    adsenseClient: overrides?.adsenseClient ?? (import.meta.env.VITE_ADSENSE_CLIENT || ''),
  };

  if (config.clarityId) {
    initClarity(config.clarityId);
  }

  if (config.gaMeasurementId) {
    initGA4(config.gaMeasurementId);
  }

  if (config.adsenseClient) {
    initAdSense(config.adsenseClient);
  }
}

/**
 * GA4 커스텀 이벤트를 전송한다.
 * gtag가 로드되지 않았으면 무시한다.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, params);
  }
}

/**
 * GA4 SPA 페이지뷰를 수동 전송한다.
 * react-router 네비게이션 시 호출한다.
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'page_view', {
      page_path: path,
      page_title: title ?? document.title,
    });
  }
}
