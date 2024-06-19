import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import FormSegment from './FormSegment.svelte'; // Adjust the import path as necessary

// Mock the utility functions
vi.mock('../utils', () => ({
	isSegmentInvalid: vi.fn(),
	isSegmentPlaceholder: vi.fn()
}));

import { isSegmentInvalid, isSegmentPlaceholder } from '../utils';

describe('FormSegment', () => {
	let segments: Segment[];
	let segment: Segment;
	let index: number;

	beforeEach(() => {
		segments = [
			{ dose: 1, daysForDose: 2 },
			{ dose: 3, daysForDose: 4 }
		];
		segment = { dose: 1, daysForDose: 2 };
		index = 0;
		isSegmentInvalid.mockReturnValue(false);
		isSegmentPlaceholder.mockReturnValue(false);
	});

	test('renders correctly', () => {
		const { container } = render(FormSegment, { segments, segment, index });
		expect(container).toMatchSnapshot();
	});

	test('handles dose change', async () => {
		const { getByDisplayValue, component } = render(FormSegment, { segments, segment, index });
		const input = getByDisplayValue('1');

		const changeHandler = vi.fn();
		component.$on('change', changeHandler);

		await fireEvent.input(input, { target: { value: '2' } });
		await fireEvent.change(input);

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { ...segment, dose: 2 }
			})
		);
	});

	test('handles daysForDose change', async () => {
		const { getByDisplayValue, component } = render(FormSegment, { segments, segment, index });
		const input = getByDisplayValue('2');

		const changeHandler = vi.fn();
		component.$on('change', changeHandler);

		await fireEvent.input(input, { target: { value: '3' } });
		await fireEvent.change(input);

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { ...segment, daysForDose: 3 }
			})
		);
	});

	test('handles remove segment', async () => {
		const { getByTitle, component } = render(FormSegment, { segments, segment, index });
		const button = getByTitle('Remove this step');

		const removeHandler = vi.fn();
		component.$on('removeSegment', removeHandler);

		await fireEvent.click(button);

		expect(removeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: index
			})
		);
	});

	test('disables remove button when segment is the only real segment', () => {
		segments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 1, daysForDose: 1 }
		];
		const { getByTitle } = render(FormSegment, { segments, segment, index });
		const button = getByTitle('Remove this step');

		expect(button).toBeDisabled();
	});

	test('applies placeholder class when segment is a placeholder', () => {
		isSegmentPlaceholder.mockReturnValue(true);
		const { container } = render(FormSegment, { segments, segment, index });

		expect(container.querySelector('.segment')).toHaveClass('placeholder');
	});

	test('applies isInvalid class when segment is invalid', () => {
		isSegmentInvalid.mockReturnValue(true);
		const { container } = render(FormSegment, { segments, segment, index });

		expect(container.querySelector('.segment')).toHaveClass('isInvalid');
	});
});
