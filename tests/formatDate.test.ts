import { test, expect } from 'vitest';
import { formatDate } from '../src/utils';

test('formatDate', () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  expect(formatDate(new Date(`${currentYear}-06-16T20:19:59+0000`))).toBe('Jun 16');
  expect(formatDate(new Date(`${nextYear}-06-16T20:19:59+0000`))).toBe('Jun 16, ' + nextYear);
});
