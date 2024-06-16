import { test, expect } from 'vitest';
import { isRowPlaceholder } from '../src/utils';

test('isRowPlaceholder', () => {
  expect(isRowPlaceholder({ dose: 0, daysForDose: 0 })).toBe(true);
  expect(isRowPlaceholder({ dose: 1, daysForDose: 0 })).toBe(false);
  expect(isRowPlaceholder({ dose: 0, daysForDose: 1 })).toBe(false);
  expect(isRowPlaceholder({ dose: 1, daysForDose: 1 })).toBe(false);
});
