import { describe, it, expect } from 'vitest';
import { formatDate } from '../src/utils';

describe('formatDate', () => {
	const currentYear = new Date().getFullYear();
	const nextYear = currentYear + 1;
	it('should format the date correctly', () => {
		const date = new Date(`${currentYear}-06-16T20:19:59+0000`);
		const formattedDate = formatDate(date);
		expect(formattedDate).toBe('Jun 16');
	});

	it('should format the date correctly', () => {
		const date = new Date(`${nextYear}-06-16T20:19:59+0000`);
		const formattedDate = formatDate(date);
		expect(formattedDate).toBe('Jun 16, ' + nextYear);
	});
});
