import { describe, it, expect } from 'vitest';
import { getPeriodsWithDosesForStep } from '../src/utils';
import { TaperDate } from '../src/TaperDate';

// Mock types
type Step = {
  dose: number;
  duration: number;
};

type DayWithDose = {
  date: string;
  dose: number;
};

describe('getPeriodsWithDosesForStep', () => {
  it('should handle half-day periods correctly', () => {
    const step: Step = { dose: 20, duration: 1 };
    const stepStartDate = new Date('2024-01-01');
    const outputPeriodSize = 'half-day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01T00:00:00')).toScheduleDate(), dose: 10, period: "in the morning" },
      { date: new TaperDate(new Date('2024-01-01T12:00:00')).toScheduleDate(), dose: 10, period: "in the evening" }
    ]);
  });

  it('should handle day periods correctly', () => {
    const step: Step = { dose: 20, duration: 3 };
    const stepStartDate = new Date('2024-01-01');
    const outputPeriodSize = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-01-02')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-01-03')).toScheduleDate(), dose: 20 }
    ]);
  });

  it('should handle week periods correctly', () => {
    const step: Step = { dose: 20, duration: 7 };
    const stepStartDate = new Date('2024-01-01');
    const outputPeriodSize = 'week';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 140 }
    ]);
  });

  it('should handle partial weeks correctly', () => {
    const step: Step = { dose: 20, duration: 10 };
    const stepStartDate = new Date('2024-01-01');
    const outputPeriodSize = 'week';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 140 },
      { date: new TaperDate(new Date('2024-01-08')).toScheduleDate(), dose: 60 }
    ]);
  });

  it('should throw an error for unsupported period types', () => {
    const step: Step = { dose: 20, duration: 1 };
    const stepStartDate = new Date('2024-01-01');
    const outputPeriodSize = 'month'; // Unsupported period type

    expect(() => getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize } as any)).toThrow('Unsupported period type: month');
  });

  // Additional Tests
  it('should handle zero dose correctly', () => {
    const step: Step = { dose: 0, duration: 3 };
    const stepStartDate = new Date('2024-01-01');
    const outputPeriodSize = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-01')).toScheduleDate(), dose: 0 },
      { date: new TaperDate(new Date('2024-01-02')).toScheduleDate(), dose: 0 },
      { date: new TaperDate(new Date('2024-01-03')).toScheduleDate(), dose: 0 }
    ]);
  });

  it('should handle zero days for dose correctly', () => {
    const step: Step = { dose: 20, duration: 0 };
    const stepStartDate = new Date('2024-01-01');
    const outputPeriodSize = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });

    expect(result).toEqual([]);
  });

  it('should handle multiple steps in sequence correctly', () => {
    const steps: Step[] = [
      { dose: 20, duration: 3 },
      { dose: 10, duration: 2 }
    ];
    const stepStartDate = new Date('2024-01-01');
    const outputPeriodSize = 'day';

    const result1 = getPeriodsWithDosesForStep({ step: steps[0], stepStartDate, outputPeriodSize });
    const result2 = getPeriodsWithDosesForStep({ step: steps[1], stepStartDate: new Date('2024-01-04'), outputPeriodSize });

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
    const step: Step = { dose: 20, duration: 3 };
    const stepStartDate = new Date('2024-02-28'); // 2024 is a leap year
    const outputPeriodSize = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-02-28')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-02-29')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-03-01')).toScheduleDate(), dose: 20 }
    ]);
  });

  it('should handle dates at the end of a month correctly', () => {
    const step: Step = { dose: 20, duration: 3 };
    const stepStartDate = new Date('2024-01-30');
    const outputPeriodSize = 'day';
    const result = getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize });

    expect(result).toEqual([
      { date: new TaperDate(new Date('2024-01-30')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-01-31')).toScheduleDate(), dose: 20 },
      { date: new TaperDate(new Date('2024-02-01')).toScheduleDate(), dose: 20 }
    ]);
  });
});
