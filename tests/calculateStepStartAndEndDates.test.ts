import { describe, it, expect } from 'vitest';
import { calculateStepStartAndEndDates } from '../src/utils';

// Mock types
type Schedule = {
  startDate: string;
  steps: { duration: number }[];
};

describe('calculateStepStartAndEndDates', () => {
  it('should calculate correct start and end dates for the first step', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      steps: [{ duration: 5 }]
    };
    const index = 0;
    const result = calculateStepStartAndEndDates(schedule, index);
    expect(result.stepStartDate.toISOString().split('T')[0]).toBe('2024-01-01');
    expect(result.stepEndDate.toISOString().split('T')[0]).toBe('2024-01-05');
  });

  it('should calculate correct start and end dates for a middle step', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      steps: [
        { duration: 5 },
        { duration: 3 },
        { duration: 7 }
      ]
    };
    const index = 1;
    const result = calculateStepStartAndEndDates(schedule, index);
    expect(result.stepStartDate.toISOString().split('T')[0]).toBe('2024-01-06');
    expect(result.stepEndDate.toISOString().split('T')[0]).toBe('2024-01-08');
  });

  it('should calculate correct start and end dates for the last step', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      steps: [
        { duration: 5 },
        { duration: 3 },
        { duration: 7 }
      ]
    };
    const index = 2;
    const result = calculateStepStartAndEndDates(schedule, index);
    expect(result.stepStartDate.toISOString().split('T')[0]).toBe('2024-01-09');
    expect(result.stepEndDate.toISOString().split('T')[0]).toBe('2024-01-15');
  });

  it('should handle a schedule with a single step', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      steps: [{ duration: 10 }]
    };
    const index = 0;
    const result = calculateStepStartAndEndDates(schedule, index);
    expect(result.stepStartDate.toISOString().split('T')[0]).toBe('2024-01-01');
    expect(result.stepEndDate.toISOString().split('T')[0]).toBe('2024-01-10');
  });

  it('should handle a schedule with multiple steps of varying lengths', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      steps: [
        { duration: 2 },
        { duration: 5 },
        { duration: 1 },
        { duration: 3 }
      ]
    };
    const index = 3;
    const result = calculateStepStartAndEndDates(schedule, index);
    expect(result.stepStartDate.toISOString().split('T')[0]).toBe('2024-01-09');
    expect(result.stepEndDate.toISOString().split('T')[0]).toBe('2024-01-11');
  });

  it('should throw an error if the index is out of bounds', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      steps: [{ duration: 5 }]
    };
    const index = 1;
    expect(() => calculateStepStartAndEndDates(schedule, index)).toThrow();
  });

  it('should handle an empty schedule', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      steps: []
    };
    const index = 0;
    expect(() => calculateStepStartAndEndDates(schedule, index)).toThrow();
  });
});
