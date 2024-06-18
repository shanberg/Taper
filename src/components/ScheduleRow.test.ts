import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import { render } from '@testing-library/svelte';
import { LANGUAGES } from '../consts';
import '@testing-library/jest-dom';
import ScheduleRow from './ScheduleRow.svelte';

vi.mock('../utils', () => ({
    formatRowText: vi.fn(),
    isRowInvalid: vi.fn()
}));

import { formatRowText, isRowInvalid } from '../utils';

describe('ScheduleRow', () => {
    let tableData: UITableData;
    let startDate: Date;
    let selectedLanguage: Language;
    let row: Row;
    let index: number;

    beforeEach(() => {
        tableData = [
            { dose: 1, daysForDose: 5 },
            { dose: 2, daysForDose: 3 }
        ];
        startDate = new Date('2024-06-01');
        selectedLanguage = LANGUAGES.find(language => language.labelEn === 'Arabic') as Language;
        row = { dose: 1, daysForDose: 5 };
        index = 0;

        (formatRowText as Mock).mockImplementation(
            ({ row, rowStartDate, rowEndDate, index, selectedLanguage }) => {
                return `Row ${index + 1}: ${row.dose} dose(s) from ${rowStartDate.toDateString()} to ${rowEndDate.toDateString()}`;
            }
        );

        (isRowInvalid as Mock).mockImplementation((row) => row.dose < 0 || row.daysForDose < 0);
    });


    test('renders correctly', () => {
        const { container } = render(ScheduleRow, {
            props: {
                tableData,
                startDate,
                selectedLanguage,
                row,
                index
            }
        });
        expect(container).toMatchSnapshot();
    });

    test('applies isInvalid class when the row is invalid', () => {
        row = { dose: -1, daysForDose: 5 };
        const { container } = render(ScheduleRow, {
            props: {
                tableData,
                startDate,
                selectedLanguage,
                row,
                index
            }
        });
        expect(container.querySelector('li')).toHaveClass('isInvalid');
    });

    test('applies isRowPlaceholder class when the row is a placeholder', () => {
        row = { dose: 0, daysForDose: 0 };
        const { container } = render(ScheduleRow, {
            props: {
                tableData,
                startDate,
                selectedLanguage,
                row,
                index
            }
        });
        expect(container.querySelector('li')).toHaveClass('isRowPlaceholder');
    });

    test('does not render the last placeholder row', () => {
        tableData = [
            { dose: 1, daysForDose: 5 },
            { dose: 0, daysForDose: 0 }
        ];
        row = { dose: 0, daysForDose: 0 };
        index = 1;
        const { container } = render(ScheduleRow, {
            props: {
                tableData,
                startDate,
                selectedLanguage,
                row,
                index
            }
        });
        expect(container.querySelector('li')).not.toBeInTheDocument();
    });

    test('formats the row text correctly', () => {
        const { getByText } = render(ScheduleRow, {
            props: {
                tableData,
                startDate,
                selectedLanguage,
                row,
                index
            }
        });
        expect(getByText(/Row 1: 1 dose\(s\) from/)).toBeInTheDocument();
    });
});