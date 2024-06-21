import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ScheduleList from './ScheduleList.svelte';
import { appStore } from '../stores';
import { TaperDate } from '../TaperDate';
import { DEFAULT_LANGUAGE_KEY, DEFAULT_TEMPLATE_KEY } from '../consts';

describe('ScheduleList component', () => {
	it('renders the component with default segments', () => {
		const segments = [
			{ dose: 10, daysForDose: 7 },
			{ dose: 5, daysForDose: 14 },
			{ dose: 0, daysForDose: 0 }
		];
		appStore.set({
			startDateInputValue: '2000-01-01' as InputStringDate,
			schedule: {
				segments,
				startDate: new TaperDate('2000-01-01').toScheduleDate(),
				templateKey: DEFAULT_TEMPLATE_KEY,
				languageKey: DEFAULT_LANGUAGE_KEY
			},
			undoStack: [],
			redoStack: []
		});

		render(ScheduleList);

		const doseInput = screen.getByRole('spinbutton', { name: /dose-1/i });
		expect(doseInput).toBeInTheDocument();

		const daysInput = screen.getByRole('spinbutton', { name: /days-1/i });
		expect(daysInput).toBeInTheDocument();
	});
});
