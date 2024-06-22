import { test, expect } from 'vitest';
import { isSegmentDirectlyAfterPlaceholder } from '../src/utils';

test('isSegmentDirectlyAfterPlaceholder', () => {
  const segments = [
    { dose: 1, daysForDose: 1 },
    { dose: 2, daysForDose: 2 },
    { dose: 0, daysForDose: 0 },
    { dose: 3, daysForDose: 3 },
    { dose: 4, daysForDose: 4 }
  ]

  expect(isSegmentDirectlyAfterPlaceholder(segments, 0)).toBe(false);
  expect(isSegmentDirectlyAfterPlaceholder(segments, 1)).toBe(false);
  expect(isSegmentDirectlyAfterPlaceholder(segments, 2)).toBe(false);
  expect(isSegmentDirectlyAfterPlaceholder(segments, 3)).toBe(true);
  expect(isSegmentDirectlyAfterPlaceholder(segments, 4)).toBe(false);
});
