import { describe, it, expect } from 'vitest';
import { calculateSegmentStartAndEndDates } from '../src/utils';
import { TaperDate } from '../src/TaperDate';

const mockScheduleStartDate = new TaperDate('2000-01-01').toScheduleDate();

const mockSchedule = {
  segments: [
    { dose: 10, daysForDose: 1 },
    { dose: 10, daysForDose: 5 },
    { dose: 10, daysForDose: 10 },
  ],
  startDate: mockScheduleStartDate
}

describe("calculateSegmentStartAndEndDates", () => {
  it("should correctly calculate start and end dates for the first segment", () => {
    const { segmentStartDate, segmentEndDate } = calculateSegmentStartAndEndDates(mockSchedule, 0);
    expect(segmentStartDate).toEqual(new TaperDate('2000-01-01').toScheduleDate())
    expect(segmentEndDate).toEqual(new TaperDate('2000-01-01').toScheduleDate())
  })
  it("should correctly calculate start and end dates for a middle segment", () => {
    const { segmentStartDate, segmentEndDate } = calculateSegmentStartAndEndDates(mockSchedule, 1);
    expect(segmentStartDate).toEqual(new TaperDate('2000-01-02').toScheduleDate())
    expect(segmentEndDate).toEqual(new TaperDate('2000-01-06').toScheduleDate())
  })
  it("should correctly calculate start and end dates for the last segment", () => {
    const { segmentStartDate, segmentEndDate } = calculateSegmentStartAndEndDates(mockSchedule, 2);
    expect(segmentStartDate).toEqual(new TaperDate('2000-01-07').toScheduleDate())
    expect(segmentEndDate).toEqual(new TaperDate('2000-01-16').toScheduleDate())
  })
})