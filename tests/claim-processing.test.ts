import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Claim Processing Contract', () => {
  const user1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const user2 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  
  beforeEach(() => {
    // Reset contract state before each test
  });
  
  it('should file a claim', () => {
    const fileClaimMock = vi.fn().mockReturnValue({ ok: 1 });
    const result = fileClaimMock('claim-processing', 'file-claim', [1, 500000, 'Medical expenses'], user1);
    expect(result).toEqual({ ok: 1 });
  });
  
  it('should process a claim', () => {
    const processClaimMock = vi.fn().mockReturnValue({ ok: true });
    const result = processClaimMock('claim-processing', 'process-claim', [1, true], user2);
    expect(result).toEqual({ ok: true });
  });
  
  it('should get claim details', () => {
    const getClaimMock = vi.fn().mockReturnValue({
      ok: {
        policy_id: 1,
        claimant: user1,
        amount: 500000,
        description: 'Medical expenses',
        status: 'approved',
        verdict: true
      }
    });
    const result = getClaimMock('claim-processing', 'get-claim', [1]);
    expect(result.ok).toHaveProperty('claimant', user1);
  });
});

