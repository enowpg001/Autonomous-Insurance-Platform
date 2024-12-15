import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Insurance Pool Contract', () => {
  const user1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const user2 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  
  let mockStxGetBalance: any;
  let mockStxTransfer: any;
  let mockFtMint: any;
  let mockFtBurn: any;
  let mockMapGet: any;
  let mockMapSet: any;
  let mockVarGet: any;
  let mockVarSet: any;
  
  beforeEach(() => {
    mockStxGetBalance = vi.fn();
    mockStxTransfer = vi.fn();
    mockFtMint = vi.fn();
    mockFtBurn = vi.fn();
    mockMapGet = vi.fn();
    mockMapSet = vi.fn();
    mockVarGet = vi.fn();
    mockVarSet = vi.fn();
    
    vi.mock('@stacks/transactions', () => ({
      callReadOnlyFunction: vi.fn((options) => {
        if (options.functionName === 'stake') {
          return mockStxTransfer();
        } else if (options.functionName === 'unstake') {
          return mockStxTransfer();
        } else if (options.functionName === 'get-staked-amount') {
          return mockMapGet();
        } else if (options.functionName === 'get-total-staked') {
          return mockVarGet();
        }
      }),
    }));
  });
  
  it('should allow staking', async () => {
    const stakeAmount = 1000000;
    mockStxGetBalance.mockReturnValue(2000000);
    mockStxTransfer.mockResolvedValue({ success: true });
    mockFtMint.mockResolvedValue({ success: true });
    mockMapGet.mockReturnValue(0);
    mockMapSet.mockReturnValue(true);
    mockVarGet.mockReturnValue(0);
    mockVarSet.mockReturnValue(true);
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'stake',
      functionArgs: [stakeAmount],
      senderAddress: user1,
    });
    
    expect(result).toEqual({ success: true, value: stakeAmount });
    expect(mockStxTransfer).toHaveBeenCalledWith(stakeAmount, user1, contractAddress);
    expect(mockFtMint).toHaveBeenCalledWith('pool-token', stakeAmount, user1);
    expect(mockMapSet).toHaveBeenCalledWith('stakers', user1, stakeAmount);
    expect(mockVarSet).toHaveBeenCalledWith('total-staked', stakeAmount);
  });
  
  it('should not allow staking more than balance', async () => {
    const stakeAmount = 2000000;
    mockStxGetBalance.mockReturnValue(1000000);
    
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
    mockMapGet.mockReturnValue(1000000);
    mockFtBurn.mockResolvedValue({ success: true });
    mockStxTransfer.mockResolvedValue({ success: true });
    mockMapSet.mockReturnValue(true);
    mockVarGet.mockReturnValue(1000000);
    mockVarSet.mockReturnValue(true);
    
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'insurance-pool',
      functionName: 'unstake',
      functionArgs: [unstakeAmount],
      senderAddress: user1,
    });
    
    expect(result).toEqual({ success: true, value: unstakeAmount });
    expect(mockFtBurn).toHaveBeenCalledWith('pool-token', unstakeAmount, user1);
    expect(mockStxTransfer).toHaveBeenCalledWith(unstakeAmount, contractAddress, user1);
    expect(mockMapSet).toHaveBeenCalledWith('stakers', user1, 500000);
    expect(mockVarSet).toHaveBeenCalledWith('total-staked', 500000);
  });
  
  it('should not allow unstaking more than staked', async () => {
    const unstakeAmount = 1000000;
    mockMapGet.mockReturnValue(500000);
    
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
    mockMapGet.mockReturnValue(1000000);
    
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
    mockVarGet.mockReturnValue(2000000);
    
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

