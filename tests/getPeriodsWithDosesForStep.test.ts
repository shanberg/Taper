import { describe, it, expect } from 'vitest';
import { getPeriodsWithDosesForStep } from '../src/utils';
import { TaperDate } from '../src/TaperDate';

// Mock types
type Step = {
  dose: number;
  daysForDose: number;
};

type DayWithDose = {
  date: string;
  dose: number;
};

describe('getPeriodsWithDosesForStep', () => {
  it('should handle half-day periods correctly', () => {
    const step: Step = { dose: 20, daysForDose: 1 };
    const stepStartDate = new Date('2024-01-01');
    const periodType = 'half-day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, periodType });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01T00:00:00')).toScheduleDate(), dose: 10 },
      { date: new TaperDate(new Date('2024-01-01T12:00:00')).toScheduleDate(), dose: 10 }
    ]);
  });

  it('should handle day periods correctly', () => {
    const step: Step = { dose: 20, daysForDose: 3 };
    const stepStartDate = new Date('2024-01-01');
    const periodType = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, periodType });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-01-02')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-01-03')).toScheduleDate(), dose: 20 }
    ]);
  });

  it('should handle week periods correctly', () => {
    const step: Step = { dose: 20, daysForDose: 7 };
    const stepStartDate = new Date('2024-01-01');
    const periodType = 'week';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, periodType });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 140 }
    ]);
  });

  it('should handle partial weeks correctly', () => {
    const step: Step = { dose: 20, daysForDose: 10 };
    const stepStartDate = new Date('2024-01-01');
    const periodType = 'week';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, periodType });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 140 },
      { date: new TaperDate(new Date('2024-01-08')).toScheduleDate(), dose: 60 }
    ]);
  });

  it('should throw an error for unsupported period types', () => {
    const step: Step = { dose: 20, daysForDose: 1 };
    const stepStartDate = new Date('2024-01-01');
    const periodType = 'month'; // Unsupported period type

    expect(() => getPeriodsWithDosesForStep({ step, stepStartDate, periodType } as any)).toThrow('Unsupported period type: month');
  });

  // Additional Tests
  it('should handle zero dose correctly', () => {
    const step: Step = { dose: 0, daysForDose: 3 };
    const stepStartDate = new Date('2024-01-01');
    const periodType = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, periodType });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 0 },
      { date: new TaperDate(new Date('2024-01-02')).toScheduleDate(), dose: 0 },
      { date: new TaperDate(new Date('2024-01-03')).toScheduleDate(), dose: 0 }
    ]);
  });

  it('should handle zero days for dose correctly', () => {
    const step: Step = { dose: 20, daysForDose: 0 };
    const stepStartDate = new Date('2024-01-01');
    const periodType = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, periodType });

    expect(result).toEqual([]);
  });

  it('should handle multiple steps in sequence correctly', () => {
    const steps: Step[] = [
      { dose: 20, daysForDose: 3 },
      { dose: 10, daysForDose: 2 }
    ];
    const stepStartDate = new Date('2024-01-01');
    const periodType = 'day';

    const result1 = getPeriodsWithDosesForStep({ step: steps[0], stepStartDate, periodType });
    const result2 = getPeriodsWithDosesForStep({ step: steps[1], stepStartDate: new Date('2024-01-04'), periodType });

    expect(result1).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-01-02')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-01-03')).toScheduleDate(), dose: 20 }
    ]);

    expect(result2).toEqual([
      { date: new TaperDate(new Date('2024-01-04')).toScheduleDate(), dose: 10 },
      { date: new TaperDate(new Date('2024-01-05')).toScheduleDate(), dose: 10 }
    ]);
  });

  it('should handle dates around a leap year correctly', () => {
    const step: Step = { dose: 20, daysForDose: 3 };
    const stepStartDate = new Date('2024-02-28'); // 2024 is a leap year
    const periodType = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, periodType });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-02-28')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-02-29')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-03-01')).toScheduleDate(), dose: 20 }
    ]);
  });

  it('should handle dates at the end of a month correctly', () => {
    const step: Step = { dose: 20, daysForDose: 3 };
    const stepStartDate = new Date('2024-01-30');
    const periodType = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, periodType });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-30')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-01-31')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-02-01')).toScheduleDate(), dose: 20 }
    ]);
  });
});
