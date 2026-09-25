import { describe, it, expect } from 'vitest';
import { calculateFinancialHealth } from './financialHealth';

describe('Financial Health Indicator', () => {
  it('Test Case 1 — Healthy 50%', () => {
    const result = calculateFinancialHealth(10000000, 5000000);
    expect(result.status).toBe('HEALTHY');
    expect(result.expenseRatio).toBe(50);
  });

  it('Test Case 2 — Attention 80%', () => {
    const result = calculateFinancialHealth(10000000, 8000000);
    expect(result.status).toBe('ATTENTION');
    expect(result.expenseRatio).toBe(80);
  });

  it('Test Case 3 — Attention 100%', () => {
    const result = calculateFinancialHealth(10000000, 10000000);
    expect(result.status).toBe('ATTENTION');
    expect(result.expenseRatio).toBe(100);
    expect(result.netBalance).toBe(0);
  });

  it('Test Case 4 — Deficit 120%', () => {
    const result = calculateFinancialHealth(10000000, 12000000);
    expect(result.status).toBe('DEFICIT');
    expect(result.expenseRatio).toBe(120);
    expect(result.netBalance).toBe(-2000000);
  });

  it('Test Case 5 — No Data', () => {
    const result = calculateFinancialHealth(0, 0);
    expect(result.status).toBe('NO_DATA');
    expect(result.expenseRatio).toBeNull();
  });

  it('Test Case 6 — No Income', () => {
    const result = calculateFinancialHealth(0, 2000000);
    expect(result.status).toBe('NO_INCOME');
    expect(result.expenseRatio).toBeNull();
    expect(result.netBalance).toBe(-2000000);
  });

  it('Test Case 7 — No Expense', () => {
    const result = calculateFinancialHealth(10000000, 0);
    expect(result.status).toBe('HEALTHY');
    expect(result.expenseRatio).toBe(0);
    expect(result.netBalance).toBe(10000000);
  });
});
