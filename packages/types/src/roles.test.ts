import { describe, it, expect } from 'vitest';
import { hasPermission, ROLE_PERMISSIONS, ROLE_LABELS } from './roles';

describe('ROLE_LABELS', () => {
  it('defines a label for every role', () => {
    expect(Object.keys(ROLE_LABELS)).toEqual(['leader', 'member', 'user']);
  });

  it('labels are non-empty strings', () => {
    for (const label of Object.values(ROLE_LABELS)) {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

describe('ROLE_PERMISSIONS', () => {
  it('leader has all permissions', () => {
    expect(ROLE_PERMISSIONS.leader).toContain('manage_team');
    expect(ROLE_PERMISSIONS.leader).toContain('view_applications');
    expect(ROLE_PERMISSIONS.leader).toContain('use_services');
    expect(ROLE_PERMISSIONS.leader).toContain('manage_profile');
  });

  it('member cannot manage_team', () => {
    expect(ROLE_PERMISSIONS.member).not.toContain('manage_team');
    expect(ROLE_PERMISSIONS.member).not.toContain('view_applications');
  });

  it('member can use_services', () => {
    expect(ROLE_PERMISSIONS.member).toContain('use_services');
  });

  it('user has minimal permissions', () => {
    expect(ROLE_PERMISSIONS.user).toEqual(['use_services', 'manage_profile']);
  });

  it('permissions are subsets: user ⊂ member ⊂ leader', () => {
    for (const perm of ROLE_PERMISSIONS.user) {
      expect(ROLE_PERMISSIONS.member).toContain(perm);
    }
    for (const perm of ROLE_PERMISSIONS.member) {
      expect(ROLE_PERMISSIONS.leader).toContain(perm);
    }
  });
});

describe('hasPermission', () => {
  it('returns true for valid role + permission', () => {
    expect(hasPermission('leader', 'manage_team')).toBe(true);
    expect(hasPermission('user', 'use_services')).toBe(true);
  });

  it('returns false for insufficient role', () => {
    expect(hasPermission('user', 'manage_team')).toBe(false);
    expect(hasPermission('member', 'view_applications')).toBe(false);
  });

  it('returns false for undefined role', () => {
    expect(hasPermission(undefined, 'use_services')).toBe(false);
  });
});
