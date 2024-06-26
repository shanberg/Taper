import { test, expect } from 'vitest';
import { isStepPlaceholder } from '../src/utils';

test('isStepPlaceholder', () => {
	expect(isStepPlaceholder({ dose: 0, duration: 0 })).toBe(true);
	expect(isStepPlaceholder({ dose: 1, duration: 0 })).toBe(false);
	expect(isStepPlaceholder({ dose: 0, duration: 1 })).toBe(false);
	expect(isStepPlaceholder({ dose: 1, duration: 1 })).toBe(false);
});