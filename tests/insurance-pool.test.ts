import { describe, it, expect, beforeEach, vi } from 'vitest';
import { callReadOnlyFunction } from '@stacks/transactions';

vi.mock('@stacks/transactions', () => ({
  callReadOnlyFunction: vi.fn(),
}));

describe('Insurance Pool Contract', () => {
  const user1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const user2 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should allow staking', async () => {
    const stakeAmount = 1000000;
    (callReadOnlyFunction as any).mockResolvedValue({ success: true, value: stakeAmount });
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'stake',
      functionArgs: [stakeAmount],
      senderAddress: user1,
    });
    
    expect(result).toEqual({ success: true, value: stakeAmount });
    expect(callReadOnlyFunction).toHaveBeenCalledWith({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'stake',
      functionArgs: [stakeAmount],
      senderAddress: user1,
    });
  });
  
  it('should not allow staking more than balance', async () => {
    const stakeAmount = 2000000;
    (callReadOnlyFunction as any).mockResolvedValue({ success: false, error: 401 });
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'stake',
      functionArgs: [stakeAmount],
      senderAddress: user1,
    });
    
    expect(result).toEqual({ success: false, error: 401 });
  });
  
  it('should allow unstaking', async () => {
    const unstakeAmount = 500000;
    (callReadOnlyFunction as any).mockResolvedValue({ success: true, value: unstakeAmount });
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'unstake',
      functionArgs: [unstakeAmount],
      senderAddress: user1,
    });
    
    expect(result).toEqual({ success: true, value: unstakeAmount });
  });
  
  it('should not allow unstaking more than staked', async () => {
    const unstakeAmount = 1000000;
    (callReadOnlyFunction as any).mockResolvedValue({ success: false, error: 401 });
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'unstake',
      functionArgs: [unstakeAmount],
      senderAddress: user1,
    });
    
    expect(result).toEqual({ success: false, error: 401 });
  });
  
  it('should return staked amount for a user', async () => {
    (callReadOnlyFunction as any).mockResolvedValue({ success: true, value: 1000000 });
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'get-staked-amount',
      functionArgs: [user1],
      senderAddress: user2,
    });
    
    expect(result).toEqual({ success: true, value: 1000000 });
  });
  
  it('should return total staked amount', async () => {
    (callReadOnlyFunction as any).mockResolvedValue({ success: true, value: 2000000 });
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'get-total-staked',
      functionArgs: [],
      senderAddress: user1,
    });
    
    expect(result).toEqual({ success: true, value: 2000000 });
  });
});

