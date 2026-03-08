import { describe, it, expect } from 'vitest';
import { VALID_ROLES } from './auth.types';

describe('VALID_ROLES', () => {
  it('contains exactly 3 roles', () => {
    expect(VALID_ROLES).toHaveLength(3);
  });

  it('includes leader, member, user', () => {
    expect(VALID_ROLES).toContain('leader');
    expect(VALID_ROLES).toContain('member');
    expect(VALID_ROLES).toContain('user');
  });

  it('does not include unknown roles', () => {
    expect(VALID_ROLES).not.toContain('admin');
    expect(VALID_ROLES).not.toContain('guest');
  });
});
