import { test, expect } from 'vitest';
import { isStepDirectlyAfterPlaceholder } from '../src/utils';

test('isStepDirectlyAfterPlaceholder', () => {
  const steps = [
    { dose: 1, duration: 1 },
    { dose: 2, duration: 2 },
    { dose: 0, duration: 0 },
    { dose: 3, duration: 3 },
    { dose: 4, duration: 4 }
  ]

  expect(isStepDirectlyAfterPlaceholder(steps, 0)).toBe(false);
  expect(isStepDirectlyAfterPlaceholder(steps, 1)).toBe(false);
  expect(isStepDirectlyAfterPlaceholder(steps, 2)).toBe(false);
  expect(isStepDirectlyAfterPlaceholder(steps, 3)).toBe(true);
  expect(isStepDirectlyAfterPlaceholder(steps, 4)).toBe(false);
});
