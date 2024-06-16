// tests/formatDate.test.js
import { describe, it, expect } from 'vitest';
import { yyyymmdd } from '../src/utils';

describe('yyyymmdd', () => {
	it('should format the date correctly', () => {
		const date = new Date(`2024-06-16T20:19:59+0000`);
		const formattedDate = yyyymmdd(date);
		expect(formattedDate).toBe('2024-06-16');
	});
});
