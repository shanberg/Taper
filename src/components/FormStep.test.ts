import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import FormStep from './FormStep.svelte';

describe('FormStep', () => {
	let steps: Step[];
	let step: Step;
	let index: number;

	beforeEach(() => {
		steps = [
			{ dose: 1, daysForDose: 2 },
			{ dose: 3, daysForDose: 4 }
		];
		step = { dose: 1, daysForDose: 2 };
		index = 0;
	});

	test('renders correctly', () => {
		const { container } = render(FormStep, { steps, step, index });
		expect(container).toMatchSnapshot();
	});

	test('handles dose change', async () => {
		const { getByDisplayValue, component } = render(FormStep, { steps, step, index });
		const input = getByDisplayValue('1');

		const changeHandler = vi.fn();
		component.$on('change', changeHandler);

		await fireEvent.input(input, { target: { value: '2' } });
		await fireEvent.change(input);

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { ...step, dose: 2 }
			})
		);
	});

	test('handles daysForDose change', async () => {
		const { getByDisplayValue, component } = render(FormStep, { steps, step, index });
		const input = getByDisplayValue('2');

		const changeHandler = vi.fn();
		component.$on('change', changeHandler);

		await fireEvent.input(input, { target: { value: '3' } });
		await fireEvent.change(input);

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { ...step, daysForDose: 3 }
			})
		);
	});

	test('handles remove step', async () => {
		const { getByTitle, component } = render(FormStep, { steps, step, index });
		const button = getByTitle('Remove this step');

		const removeHandler = vi.fn();
		component.$on('removeStep', removeHandler);

		await fireEvent.click(button);

		expect(removeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: index
			})
		);
	});

	test('disables remove button when step is the only real step', () => {
		steps = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 1, daysForDose: 1 }
		];
		const { getByTitle } = render(FormStep, { steps, step, index });
		const button = getByTitle('Remove this step');

		expect(button).toBeDisabled();
	});

	test('applies isPlaceholder class when step is a placeholder', () => {
		// isStepPlaceholder.mockReturnValue(true);
		const { container } = render(FormStep, {
			steps,
			step: { dose: 0, daysForDose: 0 },
			index
		});
		expect(container.querySelector('.step')).toHaveClass('isPlaceholder');
	});

	test('applies isInvalid class when step is invalid', () => {
		// isStepInvalid.mockReturnValue(true);
		const { container } = render(FormStep, {
			steps,
			step: { dose: -1, daysForDose: 0 },
			index
		});
		expect(container.querySelector('.step')).toHaveClass('isInvalid');
	});
});
