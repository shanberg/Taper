/**
 * @fileoverview Tests for FormSegment: dose/days inputs, remove button, placeholder and invalid styling.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import FormSegment from './FormSegment.svelte';

/** Suite: FormSegment dose/days inputs, remove button, placeholder and invalid styling. */
describe('FormSegment', () => {
	let segments: Segment[];
	let segment: Segment;
	let index: number;

	/** Resets segments, segment, and index before each test. */
	beforeEach(() => {
		segments = [
			{ dose: 1, daysForDose: 2 },
			{ dose: 3, daysForDose: 4 }
		];
		segment = { dose: 1, daysForDose: 2 };
		index = 0;
	});

	/**
	 * Renders FormSegment with optional overrides for segments, segment, index.
	 * @param props - Optional overrides for segments, segment, index
	 * @returns Result of render(FormSegment, …)
	 */
	function renderFormSegment(props: {
		segments?: Segment[];
		segment?: Segment;
		index?: number;
	} = {}) {
		return render(FormSegment, {
			segments: props.segments ?? segments,
			segment: props.segment ?? segment,
			index: props.index ?? index
		});
	}

	/**
	 * Changes input from displayValue to newValue and asserts the change event detail equals expectedDetail.
	 * @param displayValue - Current display value used to find the input
	 * @param newValue - Value to set on the input
	 * @param expectedDetail - Expected segment in the change event detail
	 * @returns Promise that resolves when the assertion has run
	 */
	async function changeInputAndExpectSegmentChange(
		displayValue: string,
		newValue: string,
		expectedDetail: Segment
	) {
		const { getByDisplayValue, component } = renderFormSegment();
		const handler = vi.fn();
		component.$on('change', handler);
		const input = getByDisplayValue(displayValue);
		await fireEvent.input(input, { target: { value: newValue } });
		await fireEvent.change(input);
		expect(handler).toHaveBeenCalledWith(expect.objectContaining({ detail: expectedDetail }));
	}

	/**
	 * Clicks the remove button and asserts the removeSegment event detail equals expectedIndex.
	 * @param expectedIndex - Expected index in the removeSegment event detail
	 * @returns Promise that resolves when the assertion has run
	 */
	async function clickRemoveAndExpectIndex(expectedIndex: number) {
		const { getByTitle, component } = renderFormSegment();
		const handler = vi.fn();
		component.$on('removeSegment', handler);
		await fireEvent.click(getByTitle('Remove this step'));
		expect(handler).toHaveBeenCalledWith(expect.objectContaining({ detail: expectedIndex }));
	}

	test('renders correctly', () => {
		const { container } = renderFormSegment();
		expect(container).toMatchSnapshot();
	});

	test('handles dose change', async () => {
		await changeInputAndExpectSegmentChange('1', '2', { ...segment, dose: 2 });
	});

	test('handles daysForDose change', async () => {
		await changeInputAndExpectSegmentChange('2', '3', { ...segment, daysForDose: 3 });
	});

	test('handles remove segment', async () => {
		await clickRemoveAndExpectIndex(index);
	});

	test('disables remove button when segment is the only real segment', () => {
		segments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 1, daysForDose: 1 }
		];
		const { getByTitle } = renderFormSegment();
		const button = getByTitle('Remove this step');

		expect(button).toBeDisabled();
	});

	test('applies isPlaceholder class when segment is a placeholder', () => {
		const { container } = renderFormSegment({
			segment: { dose: 0, daysForDose: 0 }
		});
		expect(container.querySelector('.segment')).toHaveClass('isPlaceholder');
	});

	test('applies isInvalid class when segment is invalid', () => {
		const { container } = renderFormSegment({
			segment: { dose: -1, daysForDose: 0 }
		});
		expect(container.querySelector('.segment')).toHaveClass('isInvalid');
	});
});
