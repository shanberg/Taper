import { test, expect } from 'vitest';
import { sumStepsDays } from '../src/utils';

test('sumStepsDays', () => {
  const steps = [{
    dose: 1,
    duration: 2
  }, {
    dose: 2,
    duration: 2
  }, {
    dose: 3,
    duration: 2
  }]

  expect(sumStepsDays(steps)).toBe(6);
  expect(sumStepsDays([steps[0]])).toBe(2);
  expect(sumStepsDays([...steps, { dose: 12, duration: 1 }])).toBe(7);
  expect(sumStepsDays([{ dose: 100, duration: 1 }])).toBe(1);
  expect(sumStepsDays([{ dose: 1, duration: 100 }])).toBe(100);
});
