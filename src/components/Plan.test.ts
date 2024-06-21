import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Plan from './Plan.svelte';
import { appStore } from '../stores';
import { TaperDate } from '../TaperDate';
import { DEFAULT_LANGUAGE_KEY, DEFAULT_TEMPLATE_KEY } from '../consts';

describe('Plan component', () => {
	it('renders the plan heading', () => {
		render(Plan);
		expect(screen.getByRole('heading', { name: 'Plan' })).toBeInTheDocument();
	});

	it('renders a list of schedule segments', () => {
		const start = new TaperDate('2000-01-01');
		const segments = [
			{ dose: 10, daysForDose: 7 },
			{ dose: 20, daysForDose: 14 }
		];
		appStore.set({
			undoStack: [],
			redoStack: [],
			startDateInputValue: start.toYYYYMMDD(),
			schedule: {
				startDate: start.toScheduleDate(),
				languageKey: DEFAULT_LANGUAGE_KEY,
				templateKey: DEFAULT_TEMPLATE_KEY,
				segments
			}
		});

		render(Plan);

		const items = screen.getAllByRole('listitem');
		expect(items).toHaveLength(2);
	});

	it('displays the total dose and days', () => {
		const start = new TaperDate('2000-01-01');
		const segments = [
			{ dose: 10, daysForDose: 7 },
			{ dose: 20, daysForDose: 14 }
		];
		appStore.set({
			undoStack: [],
			redoStack: [],
			startDateInputValue: start.toYYYYMMDD(),
			schedule: {
				startDate: start.toScheduleDate(),
				languageKey: DEFAULT_LANGUAGE_KEY,
				templateKey: DEFAULT_TEMPLATE_KEY,
				segments
			}
		});

		render(Plan);

		expect(
			screen.getByText('Take 10mg daily for 7 days (Jan 1, 2000 - Jan 7, 2000)')
		).toBeInTheDocument();
	});
});
