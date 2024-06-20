import { describe, it, expect } from 'vitest';
import { TaperDate } from '../src/TaperDate';
import { deserializeSchedule } from '../src/utils';

describe('deserializeSchedule', () => {
  it('should deserialize a schedule with a Date object correctly', () => {
    const serializedSchedule = JSON.stringify({
      startDate: {
        __brand: 'Date',
        value: '2023-06-20'
      }
    });

    const result = deserializeSchedule(serializedSchedule);
    const expected = {
      startDate: new TaperDate('2023-06-20').toScheduleDate()
    };

    expect(result).toEqual(expected);
  });

  it('should deserialize a schedule with multiple Date objects correctly', () => {
    const serializedSchedule = JSON.stringify({
      name: 'Test Schedule',
      startDate: {
        __brand: 'Date',
        value: '2023-06-20'
      },
      endDate: {
        __brand: 'Date',
        value: '2023-06-21'
      }
    });

    const result = deserializeSchedule(serializedSchedule);
    const expected = {
      name: 'Test Schedule',
      startDate: new TaperDate('2023-06-20').toScheduleDate(),
      endDate: new TaperDate('2023-06-21').toScheduleDate()
    };

    expect(result).toEqual(expected);
  });

  it('should deserialize a schedule without Date objects correctly', () => {
    const serializedSchedule = JSON.stringify({
      name: 'Test Schedule',
      location: 'Test Location'
    });

    const result = deserializeSchedule(serializedSchedule);
    const expected = {
      name: 'Test Schedule',
      location: 'Test Location'
    };

    expect(result).toEqual(expected);
  });
});
