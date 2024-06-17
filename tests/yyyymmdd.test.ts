import { test, expect } from 'vitest';
import { yyyymmdd } from '../src/utils';

test('yyyymmdd', () => {
	// happy path
	const date = new Date(`2024-06-16T20:19:59+0000`);
	const formattedDate = yyyymmdd(date);
	expect(formattedDate).toBe('2024-06-16');

	// invalid date
	const formattedInvalidDate = yyyymmdd('asdf');
	expect(formattedInvalidDate).toBe('');
});
