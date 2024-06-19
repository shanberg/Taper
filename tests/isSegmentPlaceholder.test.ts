import { test, expect } from 'vitest';
import { isSegmentPlaceholder } from '../src/utils';

test('isSegmentPlaceholder', () => {
	expect(isSegmentPlaceholder({ dose: 0, daysForDose: 0 })).toBe(true);
	expect(isSegmentPlaceholder({ dose: 1, daysForDose: 0 })).toBe(false);
	expect(isSegmentPlaceholder({ dose: 0, daysForDose: 1 })).toBe(false);
	expect(isSegmentPlaceholder({ dose: 1, daysForDose: 1 })).toBe(false);
});
