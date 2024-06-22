import { test, expect } from 'vitest';
import { sumSegmentsDays } from '../src/utils';

test('sumSegmentsDays', () => {
  const segments = [{
    dose: 1,
    daysForDose: 2
  }, {
    dose: 2,
    daysForDose: 2
  }, {
    dose: 3,
    daysForDose: 2
  }]

  expect(sumSegmentsDays(segments)).toBe(6);
  expect(sumSegmentsDays([segments[0]])).toBe(2);
  expect(sumSegmentsDays([...segments, { dose: 12, daysForDose: 1 }])).toBe(7);
  expect(sumSegmentsDays([{ dose: 100, daysForDose: 1 }])).toBe(1);
  expect(sumSegmentsDays([{ dose: 1, daysForDose: 100 }])).toBe(100);
});
