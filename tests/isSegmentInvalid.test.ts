import { test, expect } from 'vitest';
import { isSegmentInvalid } from '../src/utils';

test('isSegmentInvalid', () => {
	expect(isSegmentInvalid({ dose: 0, daysForDose: 0 })).toBe(true);
	expect(isSegmentInvalid({ dose: 1, daysForDose: 0 })).toBe(true);
	expect(isSegmentInvalid({ dose: 0, daysForDose: 1 })).toBe(true);
	expect(isSegmentInvalid({ dose: 1, daysForDose: 1 })).toBe(false);
});
