import { test, expect } from 'vitest';
import { isStepDirectlyAfterPlaceholder } from '../src/utils';

test('isStepDirectlyAfterPlaceholder', () => {
  const steps = [
    { dose: 1, daysForDose: 1 },
    { dose: 2, daysForDose: 2 },
    { dose: 0, daysForDose: 0 },
    { dose: 3, daysForDose: 3 },
    { dose: 4, daysForDose: 4 }
  ]

  expect(isStepDirectlyAfterPlaceholder(steps, 0)).toBe(false);
  expect(isStepDirectlyAfterPlaceholder(steps, 1)).toBe(false);
  expect(isStepDirectlyAfterPlaceholder(steps, 2)).toBe(false);
  expect(isStepDirectlyAfterPlaceholder(steps, 3)).toBe(true);
  expect(isStepDirectlyAfterPlaceholder(steps, 4)).toBe(false);
});
