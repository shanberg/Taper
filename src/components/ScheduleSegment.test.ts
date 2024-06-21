import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import { render } from '@testing-library/svelte';
import { LANGUAGES } from '../consts';
import '@testing-library/jest-dom';
import ScheduleSegment from './ScheduleSegment.svelte';

vi.mock('../utils', () => ({
	formatSegmentText: vi.fn(),
	isSegmentInvalid: vi.fn()
}));

import { formatSegmentText, isSegmentInvalid } from '../utils';

describe('ScheduleSegment', () => {
	let segments: Segment[];
	let startDate: Date;
	let selectedLanguage: Language;
	let segment: Segment;
	let index: number;

	beforeEach(() => {
		segments = [
			{ dose: 1, daysForDose: 5 },
			{ dose: 2, daysForDose: 3 }
		];
		startDate = new Date('2024-06-01');
		selectedLanguage = LANGUAGES.find((language) => language.labelEn === 'Arabic') as Language;
		segment = { dose: 1, daysForDose: 5 };
		index = 0;

		(formatSegmentText as Mock).mockImplementation(
			({ segment, segmentStartDate, segmentEndDate, index }) => {
				return `Segment ${index + 1}: ${segment.dose} dose(s) from ${segmentStartDate.toLocaleDateString()} to ${segmentEndDate.toLocaleDateString()}`;
			}
		);

		(isSegmentInvalid as Mock).mockImplementation(
			(segment) => segment.dose < 0 || segment.daysForDose < 0
		);
	});

	test('renders correctly', () => {
		const { container } = render(ScheduleSegment, {
			props: {
				segments,
				startDate,
				selectedLanguage,
				segment,
				index
			}
		});
		expect(container).toMatchSnapshot();
	});

	test('applies isInvalid class when the segment is invalid', () => {
		segment = { dose: -1, daysForDose: 5 };
		const { container } = render(ScheduleSegment, {
			props: {
				segments,
				startDate,
				selectedLanguage,
				segment,
				index
			}
		});
		expect(container.querySelector('li')).toHaveClass('isInvalid');
	});

	test('applies isSegmentPlaceholder class when the segment is a placeholder', () => {
		segment = { dose: 0, daysForDose: 0 };
		const { container } = render(ScheduleSegment, {
			props: {
				segments,
				startDate,
				selectedLanguage,
				segment,
				index
			}
		});
		expect(container.querySelector('li')).toHaveClass('isSegmentPlaceholder');
	});

	test('does not render the last placeholder segment', () => {
		segments = [
			{ dose: 1, daysForDose: 5 },
			{ dose: 0, daysForDose: 0 }
		];
		segment = { dose: 0, daysForDose: 0 };
		index = 1;
		const { container } = render(ScheduleSegment, {
			props: {
				segments,
				startDate,
				selectedLanguage,
				segment,
				index
			}
		});
		expect(container.querySelector('li')).not.toBeInTheDocument();
	});

	test('formats the segment text correctly', () => {
		const { getByText } = render(ScheduleSegment, {
			props: {
				segments,
				startDate,
				selectedLanguage,
				segment,
				index
			}
		});
		expect(getByText(/Segment 1: 1 dose\(s\) from/)).toBeInTheDocument();
	});
});
