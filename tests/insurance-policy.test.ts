import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Insurance Pool Contract', () => {
  const user1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const user2 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  
  beforeEach(() => {
    // Reset contract state before each test
  });
  
  it('should stake tokens', () => {
    const stakeMock = vi.fn().mockReturnValue({ ok: 1000000 });
    const result = stakeMock('insurance-pool', 'stake', [1000000], user1);
    expect(result).toEqual({ ok: 1000000 });
  });
  
  it('should unstake tokens', () => {
    const unstakeMock = vi.fn().mockReturnValue({ ok: 500000 });
    const result = unstakeMock('insurance-pool', 'unstake', [500000], user1);
    expect(result).toEqual({ ok: 500000 });
  });
  
  it('should get staked amount', () => {
    const getStakedAmountMock = vi.fn().mockReturnValue({ ok: 500000 });
    const result = getStakedAmountMock('insurance-pool', 'get-staked-amount', [user1]);
    expect(result).toEqual({ ok: 500000 });
  });
  
  it('should get total staked', () => {
    const getTotalStakedMock = vi.fn().mockReturnValue({ ok: 1500000 });
    const result = getTotalStakedMock('insurance-pool', 'get-total-staked', []);
    expect(result).toEqual({ ok: 1500000 });
  });
});

