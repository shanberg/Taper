import { test, expect } from 'vitest';
import { sumSegmentsDose } from '../src/utils';

test('sumSegmentsDose', () => {
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


  expect(sumSegmentsDose(segments)).toBe(12);
  expect(sumSegmentsDose([segments[0]])).toBe(2);
  expect(sumSegmentsDose([...segments, { dose: 12, daysForDose: 1 }])).toBe(24);
  expect(sumSegmentsDose([{ dose: 100, daysForDose: 1 }])).toBe(100);
  expect(sumSegmentsDose([{ dose: 1, daysForDose: 100 }])).toBe(100);
});
