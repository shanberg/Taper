import { test, expect } from 'vitest';
import { sumStepsDays } from '../src/utils';

test('sumStepsDays', () => {
  const steps = [{
    dose: 1,
    daysForDose: 2
  }, {
    dose: 2,
    daysForDose: 2
  }, {
    dose: 3,
    daysForDose: 2
  }]

  expect(sumStepsDays(steps)).toBe(6);
  expect(sumStepsDays([steps[0]])).toBe(2);
  expect(sumStepsDays([...steps, { dose: 12, daysForDose: 1 }])).toBe(7);
  expect(sumStepsDays([{ dose: 100, daysForDose: 1 }])).toBe(1);
  expect(sumStepsDays([{ dose: 1, daysForDose: 100 }])).toBe(100);
});
