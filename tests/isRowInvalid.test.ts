import { test, expect } from 'vitest';
import { isRowInvalid } from '../src/utils';

test('isRowInvalid', () => {
	expect(isRowInvalid({ dose: 0, daysForDose: 0 })).toBe(true);
	expect(isRowInvalid({ dose: 1, daysForDose: 0 })).toBe(true);
	expect(isRowInvalid({ dose: 0, daysForDose: 1 })).toBe(true);
	expect(isRowInvalid({ dose: 1, daysForDose: 1 })).toBe(false);
});
