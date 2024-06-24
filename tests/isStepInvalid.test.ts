import { test, expect } from 'vitest';
import { isStepInvalid } from '../src/utils';

test('isStepInvalid', () => {
	expect(isStepInvalid({ dose: 0, duration: 0 })).toBe(true);
	expect(isStepInvalid({ dose: 1, duration: 0 })).toBe(true);
	expect(isStepInvalid({ dose: 0, duration: 1 })).toBe(true);
	expect(isStepInvalid({ dose: 1, duration: 1 })).toBe(false);
});
