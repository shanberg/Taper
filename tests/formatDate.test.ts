import { test, expect } from 'vitest';
import { cachedFormatDate } from '../src/utils';

test('cachedFormatDate', () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  expect(cachedFormatDate(new Date(`${currentYear}-06-16T20:19:59+0000`))).toBe('Jun 16');
  expect(cachedFormatDate(new Date(`${nextYear}-06-16T20:19:59+0000`))).toBe('Jun 16, ' + nextYear);
});
