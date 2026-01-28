import { describe, it, expect } from 'vitest';
import { calculateSegmentStartAndEndDates } from '../src/utils';

type Schedule = {
  startDate: string;
  segments: { daysForDose: number }[];
};

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function expectSegmentStartAndEndDates(
  _: string,
  args: {
    schedule: Schedule;
    index: number;
    expectedStart: string;
    expectedEnd: string;
  }
): void {
  const { schedule, index, expectedStart, expectedEnd } = args;
  const result = calculateSegmentStartAndEndDates(schedule, index);
  expect(toDateString(result.segmentStartDate)).toBe(expectedStart);
  expect(toDateString(result.segmentEndDate)).toBe(expectedEnd);
}

describe('calculateSegmentStartAndEndDates', () => {
  it.each<
    [
      string,
      { schedule: Schedule; index: number; expectedStart: string; expectedEnd: string }
    ]
  >([
    [
      'first segment',
      {
        schedule: { startDate: '2024-01-01', segments: [{ daysForDose: 5 }] },
        index: 0,
        expectedStart: '2024-01-01',
        expectedEnd: '2024-01-05'
      }
    ],
    [
      'middle segment',
      {
        schedule: {
          startDate: '2024-01-01',
          segments: [
            { daysForDose: 5 },
            { daysForDose: 3 },
            { daysForDose: 7 }
          ]
        },
        index: 1,
        expectedStart: '2024-01-06',
        expectedEnd: '2024-01-08'
      }
    ],
    [
      'last segment',
      {
        schedule: {
          startDate: '2024-01-01',
          segments: [
            { daysForDose: 5 },
            { daysForDose: 3 },
            { daysForDose: 7 }
          ]
        },
        index: 2,
        expectedStart: '2024-01-09',
        expectedEnd: '2024-01-15'
      }
    ],
    [
      'single segment',
      {
        schedule: { startDate: '2024-01-01', segments: [{ daysForDose: 10 }] },
        index: 0,
        expectedStart: '2024-01-01',
        expectedEnd: '2024-01-10'
      }
    ],
    [
      'varying segment lengths',
      {
        schedule: {
          startDate: '2024-01-01',
          segments: [
            { daysForDose: 2 },
            { daysForDose: 5 },
            { daysForDose: 1 },
            { daysForDose: 3 }
          ]
        },
        index: 3,
        expectedStart: '2024-01-09',
        expectedEnd: '2024-01-11'
      }
    ]
  ])(
    'calculates correct start and end dates for %s',
    expectSegmentStartAndEndDates
  );

  it('throws when index is out of bounds', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: [{ daysForDose: 5 }]
    };
    expect(() => calculateSegmentStartAndEndDates(schedule, 1)).toThrow();
  });

  it('throws for empty schedule', () => {
    const schedule: Schedule = {
      startDate: '2024-01-01',
      segments: []
    };
    expect(() => calculateSegmentStartAndEndDates(schedule, 0)).toThrow();
  });
});
