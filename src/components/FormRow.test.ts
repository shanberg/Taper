import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import FormRow from './FormRow.svelte'; // Adjust the import path as necessary

// Mock the utility functions
vi.mock('../utils', () => ({
	isRowInvalid: vi.fn(),
	isRowPlaceholder: vi.fn(),
  }));

import { isRowInvalid, isRowPlaceholder } from '../utils';

describe('FormRow', () => {
	let tableData: UITableData;
	let row: Row;
	let index: number;

	beforeEach(() => {
		tableData = [
			{ dose: 1, daysForDose: 2 },
			{ dose: 3, daysForDose: 4 }
		];
		row = { dose: 1, daysForDose: 2 };
		index = 0;
		isRowInvalid.mockReturnValue(false);
		isRowPlaceholder.mockReturnValue(false);
	});

	test('renders correctly', () => {
		const { container } = render(FormRow, { tableData, row, index });
		expect(container).toMatchSnapshot();
	});

	test('handles dose change', async () => {
		const { getByDisplayValue, component } = render(FormRow, { tableData, row, index });
		const input = getByDisplayValue('1');

		const changeHandler = vi.fn();
		component.$on('change', changeHandler);

		await fireEvent.input(input, { target: { value: '2' } });
		await fireEvent.change(input);

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { ...row, dose: 2 }
			})
		);
	});

	test('handles daysForDose change', async () => {
		const { getByDisplayValue, component } = render(FormRow, { tableData, row, index });
		const input = getByDisplayValue('2');

		const changeHandler = vi.fn();
		component.$on('change', changeHandler);

		await fireEvent.input(input, { target: { value: '3' } });
		await fireEvent.change(input);

		expect(changeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { ...row, daysForDose: 3 }
			})
		);
	});

	test('handles remove row', async () => {
		const { getByTitle, component } = render(FormRow, { tableData, row, index });
		const button = getByTitle('Remove this step');

		const removeHandler = vi.fn();
		component.$on('removeRow', removeHandler);

		await fireEvent.click(button);

		expect(removeHandler).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: index
			})
		);
	});

	test('disables remove button when row is the only real row', () => {
		tableData = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 1, daysForDose: 1 }
		];
		const { getByTitle } = render(FormRow, { tableData, row, index });
		const button = getByTitle('Remove this step');

		expect(button).toBeDisabled();
	});

	test('applies placeholder class when row is a placeholder', () => {
		isRowPlaceholder.mockReturnValue(true);
		const { container } = render(FormRow, { tableData, row, index });

		expect(container.querySelector('.row')).toHaveClass('placeholder');
	});

	test('applies isInvalid class when row is invalid', () => {
		isRowInvalid.mockReturnValue(true);
		const { container } = render(FormRow, { tableData, row, index });

		expect(container.querySelector('.row')).toHaveClass('isInvalid');
	});
});
