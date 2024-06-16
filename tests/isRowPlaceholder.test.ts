// tests/formatDate.test.js
import { describe, it, expect } from 'vitest';
import { isRowPlaceholder } from '../src/utils';

describe('isRowPlaceholder', () => {
	it('should return true if the row is a placeholder', () => {
		const row = {
			dose: 0,
			daysForDose: 0
		};
		expect(isRowPlaceholder(row)).toBe(true);
	});

	it('should return false if the a dose has been set', () => {
		const row = {
			dose: 1,
			daysForDose: 0
		};
		expect(isRowPlaceholder(row)).toBe(false);
	});

	it('should return false if the daysForDose has been set', () => {
		const row = {
			dose: 0,
			daysForDose: 1
		};
		expect(isRowPlaceholder(row)).toBe(false);
	});

	it('should return false if both have been set', () => {
		const row = {
			dose: 1,
			daysForDose: 1
		};
		expect(isRowPlaceholder(row)).toBe(false);
	});
});
