import { test, expect } from 'vitest';
import { sumStepsDose } from '../src/utils';

test('sumStepsDose', () => {
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


  expect(sumStepsDose(steps)).toBe(12);
  expect(sumStepsDose([steps[0]])).toBe(2);
  expect(sumStepsDose([...steps, { dose: 12, duration: 1 }])).toBe(24);
  expect(sumStepsDose([{ dose: 100, duration: 1 }])).toBe(100);
  expect(sumStepsDose([{ dose: 1, duration: 100 }])).toBe(100);
});
