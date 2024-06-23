import { test, expect } from 'vitest';
import { isStepInvalid } from '../src/utils';

test('isStepInvalid', () => {
	expect(isStepInvalid({ dose: 0, daysForDose: 0 })).toBe(true);
	expect(isStepInvalid({ dose: 1, daysForDose: 0 })).toBe(true);
	expect(isStepInvalid({ dose: 0, daysForDose: 1 })).toBe(true);
	expect(isStepInvalid({ dose: 1, daysForDose: 1 })).toBe(false);
});
