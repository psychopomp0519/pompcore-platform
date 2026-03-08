/**
 * @file Error message mapping — User-friendly error messages (17 patterns)
 * @module @pompcore/ui/utils/errorMessages
 */

const ERROR_MAP: Array<{ pattern: RegExp; message: string }> = [
  /* 인증 관련 */
  { pattern: /invalid login credentials/i, message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
  { pattern: /email not confirmed/i, message: '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.' },
  { pattern: /user already registered/i, message: '이미 가입된 이메일입니다.' },
  { pattern: /signup is disabled/i, message: '현재 회원가입이 비활성화되어 있습니다.' },
  { pattern: /email rate limit exceeded/i, message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  { pattern: /invalid.*jwt|jwt.*expired|token.*expired/i, message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.' },
  { pattern: /password.*too short|password.*characters/i, message: '비밀번호가 너무 짧습니다.' },
  { pattern: /new password should be different/i, message: '새 비밀번호는 기존 비밀번호와 달라야 합니다.' },

  /* 네트워크 / 서버 */
  { pattern: /fetch|network|ECONNREFUSED|timeout/i, message: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.' },
  { pattern: /rate limit|too many requests|429/i, message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
  { pattern: /internal server error|500/i, message: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' },

  /* DB / 권한 */
  { pattern: /permission denied|not authorized|403/i, message: '권한이 없습니다.' },
  { pattern: /relation.*does not exist|column.*does not exist/i, message: '서비스 점검 중입니다. 잠시 후 다시 시도해주세요.' },
  { pattern: /unique.*violation|duplicate key/i, message: '이미 존재하는 데이터입니다.' },
];

/** 기술적 에러를 사용자 친화적 메시지로 변환 */
export function toUserMessage(error: unknown, fallback?: string): string {
  const raw = error instanceof Error ? error.message : String(error);

  for (const { pattern, message } of ERROR_MAP) {
    if (pattern.test(raw)) return message;
  }

  return fallback ?? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

/** @alias toUserMessage — Backward-compatible alias */
export const getErrorMessage = toUserMessage;
