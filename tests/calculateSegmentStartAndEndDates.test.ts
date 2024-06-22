import { describe, it, expect } from 'vitest';
import { calculateSegmentStartAndEndDates } from '../src/utils';

// Mock types
type Schedule = {
  startDate: string;
  segments: { daysForDose: number }[];
};

describe('calculateSegmentStartAndEndDates', () => {
  it('should calculate correct start and end dates for the first segment', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: [{ daysForDose: 5 }]
    };
    const index = 0;
    const result = calculateSegmentStartAndEndDates(schedule, index);
    expect(result.segmentStartDate.toISOString().split('T')[0]).toBe('2024-01-01');
    expect(result.segmentEndDate.toISOString().split('T')[0]).toBe('2024-01-05');
  });

  it('should calculate correct start and end dates for a middle segment', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: [
        { daysForDose: 5 },
        { daysForDose: 3 },
        { daysForDose: 7 }
      ]
    };
    const index = 1;
    const result = calculateSegmentStartAndEndDates(schedule, index);
    expect(result.segmentStartDate.toISOString().split('T')[0]).toBe('2024-01-06');
    expect(result.segmentEndDate.toISOString().split('T')[0]).toBe('2024-01-08');
  });

  it('should calculate correct start and end dates for the last segment', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: [
        { daysForDose: 5 },
        { daysForDose: 3 },
        { daysForDose: 7 }
      ]
    };
    const index = 2;
    const result = calculateSegmentStartAndEndDates(schedule, index);
    expect(result.segmentStartDate.toISOString().split('T')[0]).toBe('2024-01-09');
    expect(result.segmentEndDate.toISOString().split('T')[0]).toBe('2024-01-15');
  });

  it('should handle a schedule with a single segment', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: [{ daysForDose: 10 }]
    };
    const index = 0;
    const result = calculateSegmentStartAndEndDates(schedule, index);
    expect(result.segmentStartDate.toISOString().split('T')[0]).toBe('2024-01-01');
    expect(result.segmentEndDate.toISOString().split('T')[0]).toBe('2024-01-10');
  });

  it('should handle a schedule with multiple segments of varying lengths', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: [
        { daysForDose: 2 },
        { daysForDose: 5 },
        { daysForDose: 1 },
        { daysForDose: 3 }
      ]
    };
    const index = 3;
    const result = calculateSegmentStartAndEndDates(schedule, index);
    expect(result.segmentStartDate.toISOString().split('T')[0]).toBe('2024-01-09');
    expect(result.segmentEndDate.toISOString().split('T')[0]).toBe('2024-01-11');
  });

  it('should throw an error if the index is out of bounds', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: [{ daysForDose: 5 }]
    };
    const index = 1;
    expect(() => calculateSegmentStartAndEndDates(schedule, index)).toThrow();
  });

  it('should handle an empty schedule', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: []
    };
    const index = 0;
    expect(() => calculateSegmentStartAndEndDates(schedule, index)).toThrow();
  });
});
