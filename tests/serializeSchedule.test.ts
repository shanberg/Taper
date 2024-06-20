import { describe, it, expect } from 'vitest';
import { TaperDate } from '../src/TaperDate';
import { serializeSchedule } from '../src/utils';

describe('serializeSchedule', () => {
	it('should serialize a schedule with a Date object correctly', () => {
		const newDate = new Date();

		const schedule = {
			startDate: newDate
		};

		const result = serializeSchedule(schedule);
		const expected = JSON.stringify({
			startDate: {
				__brand: 'Date',
				value: new TaperDate(newDate).toYYYYMMDD()
			}
		});

		expect(result).toBe(expected);
	});

	it('should serialize a schedule with multiple Date objects correctly', () => {
		const schedule = {
			name: 'Test Schedule',
			startDate: new Date('2023-06-20T00:00:00Z'),
			endDate: new Date('2023-06-21T00:00:00Z')
		};

		const result = serializeSchedule(schedule);
		const expected = JSON.stringify({
			name: 'Test Schedule',
			startDate: {
				__brand: 'Date',
				value: '2023-06-20'
			},
			endDate: {
				__brand: 'Date',
				value: '2023-06-21'
			}
		});

		expect(result).toBe(expected);
	});

	it('should serialize a schedule without Date objects correctly', () => {
		const schedule = {
			name: 'Test Schedule',
			location: 'Test Location'
		};

		const result = serializeSchedule(schedule);
		const expected = JSON.stringify({
			name: 'Test Schedule',
			location: 'Test Location'
		});

		expect(result).toBe(expected);
	});
});
