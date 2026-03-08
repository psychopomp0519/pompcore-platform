import { describe, it, expect } from 'vitest';
import { mapUserToProfile } from './profile';
import type { SupabaseUserLike } from './profile';

function makeUser(overrides: Partial<SupabaseUserLike> = {}): SupabaseUserLike {
  return {
    id: 'user-1',
    email: 'kim@example.com',
    user_metadata: {},
    created_at: '2025-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('mapUserToProfile', () => {
  it('returns a valid UserProfile shape', () => {
    const profile = mapUserToProfile(makeUser());
    expect(profile).toHaveProperty('id');
    expect(profile).toHaveProperty('email');
    expect(profile).toHaveProperty('displayName');
    expect(profile).toHaveProperty('avatarUrl');
    expect(profile).toHaveProperty('createdAt');
    expect(profile).toHaveProperty('role');
  });

  it('maps basic fields', () => {
    const profile = mapUserToProfile(makeUser());
    expect(profile.id).toBe('user-1');
    expect(profile.email).toBe('kim@example.com');
    expect(profile.createdAt).toBe('2025-01-01T00:00:00Z');
  });

  // ----- displayName fallback chain -----

  describe('displayName fallback', () => {
    it('1st: uses display_name', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { display_name: 'Kim', full_name: 'Kim Lee', nickname: 'k' },
      }));
      expect(profile.displayName).toBe('Kim');
    });

    it('2nd: falls back to full_name', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { full_name: 'Kim Lee', nickname: 'k' },
      }));
      expect(profile.displayName).toBe('Kim Lee');
    });

    it('3rd: falls back to nickname', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { nickname: 'k-player' },
      }));
      expect(profile.displayName).toBe('k-player');
    });

    it('4th: falls back to email prefix', () => {
      const profile = mapUserToProfile(makeUser({ email: 'kim@example.com' }));
      expect(profile.displayName).toBe('kim');
    });

    it('5th: falls back to "Player"', () => {
      const profile = mapUserToProfile(makeUser({ email: undefined, user_metadata: {} }));
      expect(profile.displayName).toBe('Player');
    });

    it('ignores empty string display_name', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { display_name: '' },
      }));
      expect(profile.displayName).toBe('kim');
    });

    it('ignores whitespace-only display_name', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { display_name: '   ' },
      }));
      expect(profile.displayName).toBe('kim');
    });

    it('ignores non-string display_name', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { display_name: 123 },
      }));
      expect(profile.displayName).toBe('kim');
    });
  });

  // ----- role mapping -----

  describe('role mapping', () => {
    it('maps valid role from metadata', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { role: 'leader' },
      }));
      expect(profile.role).toBe('leader');
    });

    it('defaults to "user" for missing role', () => {
      const profile = mapUserToProfile(makeUser());
      expect(profile.role).toBe('user');
    });

    it('defaults to "user" for invalid role', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { role: 'superadmin' },
      }));
      expect(profile.role).toBe('user');
    });
  });

  // ----- edge cases -----

  describe('edge cases', () => {
    it('handles missing user_metadata', () => {
      const profile = mapUserToProfile({ id: 'x' });
      expect(profile.displayName).toBe('Player');
      expect(profile.email).toBe('');
      expect(profile.role).toBe('user');
    });

    it('maps avatar_url', () => {
      const profile = mapUserToProfile(makeUser({
        user_metadata: { avatar_url: 'https://img.test/a.png' },
      }));
      expect(profile.avatarUrl).toBe('https://img.test/a.png');
    });

    it('defaults avatarUrl to null', () => {
      const profile = mapUserToProfile(makeUser());
      expect(profile.avatarUrl).toBeNull();
    });
  });
});
