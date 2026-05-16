import { describe, it, expect } from 'vitest';
import { generateTokens, verifyAccessToken } from '../auth';

describe('Auth Service', () => {
  it('should generate valid tokens and verify them', () => {
    const payload = { userId: '1', role: 'ADMIN' as const };
    const tokens = generateTokens(payload);
    
    const verified = verifyAccessToken(tokens.accessToken);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.role).toBe(payload.role);
  });
});
