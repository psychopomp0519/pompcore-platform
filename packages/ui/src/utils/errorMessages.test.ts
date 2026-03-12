import { describe, it, expect } from 'vitest';
import { toUserMessage, getErrorMessage } from './errorMessages';

describe('toUserMessage', () => {
  it('잘못된 로그인 → 한국어 메시지', () => {
    expect(toUserMessage(new Error('Invalid login credentials')))
      .toBe('이메일 또는 비밀번호가 올바르지 않습니다.');
  });

  it('이메일 미인증', () => {
    expect(toUserMessage(new Error('Email not confirmed')))
      .toBe('이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.');
  });

  it('중복 가입', () => {
    expect(toUserMessage(new Error('User already registered')))
      .toBe('이미 가입된 이메일입니다.');
  });

  it('JWT 만료', () => {
    expect(toUserMessage(new Error('JWT expired')))
      .toBe('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
  });

  it('네트워크 오류', () => {
    expect(toUserMessage(new Error('fetch failed')))
      .toBe('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
  });

  it('429 rate limit', () => {
    expect(toUserMessage(new Error('429 Too Many Requests')))
      .toBe('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
  });

  it('500 서버 에러', () => {
    expect(toUserMessage(new Error('Internal Server Error 500')))
      .toBe('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  });

  it('권한 없음', () => {
    expect(toUserMessage(new Error('Permission denied')))
      .toBe('권한이 없습니다.');
  });

  it('unique violation', () => {
    expect(toUserMessage(new Error('duplicate key value violates unique constraint')))
      .toBe('이미 존재하는 데이터입니다.');
  });

  it('비밀번호 관련 에러', () => {
    expect(toUserMessage(new Error('New password should be different from the old password')))
      .toBe('새 비밀번호는 기존 비밀번호와 달라야 합니다.');
  });

  it('매칭 없는 에러 → 기본 메시지', () => {
    expect(toUserMessage(new Error('Unknown weird error')))
      .toBe('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  });

  it('매칭 없는 에러 + 커스텀 fallback', () => {
    expect(toUserMessage(new Error('something'), '커스텀 에러'))
      .toBe('커스텀 에러');
  });

  it('문자열 에러도 처리', () => {
    expect(toUserMessage('Invalid login credentials'))
      .toBe('이메일 또는 비밀번호가 올바르지 않습니다.');
  });

  it('getErrorMessage는 toUserMessage의 별칭', () => {
    expect(getErrorMessage).toBe(toUserMessage);
  });
});
