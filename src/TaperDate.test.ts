import { describe, test, expect, beforeEach } from 'vitest';
import { TaperDate } from './TaperDate';

describe('TaperDate', () => {
	let taperDate: TaperDate;

	beforeEach(() => {
		taperDate = new TaperDate('2023-06-19');
	});

	test('should initialize with yyyy-mm-dd string', () => {
		const date = new TaperDate('2023-06-19');
		expect(date.toYYYYMMDD()).toBe('2023-06-19');
		expect(date.toScheduleDate().toISOString()).toBe('2023-06-19T12:00:00.000Z');
	});

	test('should initialize with Date object', () => {
		const date = new TaperDate(new Date('2023-06-19T00:00:00Z'));
		expect(date.toYYYYMMDD()).toBe('2023-06-19');
		expect(date.toScheduleDate().toISOString()).toBe('2023-06-19T12:00:00.000Z');
	});

	test('constructs with no input', () => {
		const now = new Date();
		const expectedDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).setUTCHours(12, 0, 0, 0)

		const taperDate = new TaperDate();
		expect(new Date(taperDate.toScheduleDate()).setUTCHours(12, 0, 0, 0)).toEqual(expectedDate);
	});

	test('should increment by one day', () => {
		taperDate.incrementByOneDay();
		expect(taperDate.toYYYYMMDD()).toBe('2023-06-20');
		expect(taperDate.toScheduleDate().toISOString()).toBe('2023-06-20T12:00:00.000Z');
	});

	test('should increment by several days', () => {
		taperDate.incrementByDays(4);
		expect(taperDate.toYYYYMMDD()).toBe('2023-06-23');
		expect(taperDate.toScheduleDate().toISOString()).toBe('2023-06-23T12:00:00.000Z');
	});

	test('should set date with yyyy-mm-dd string', () => {
		taperDate.setDate('2023-06-21'); // Correct format
		expect(taperDate.toYYYYMMDD()).toBe('2023-06-21');
		expect(taperDate.toScheduleDate().toISOString()).toBe('2023-06-21T12:00:00.000Z');
	});

	test('should set date with Date object', () => {
		taperDate.setDate(new Date('2023-06-21T12:00:00Z'));
		expect(taperDate.toYYYYMMDD()).toBe('2023-06-21');
		expect(taperDate.toScheduleDate().toISOString()).toBe('2023-06-21T12:00:00.000Z');
	});

	test('should throw error for invalid input type in setDate', () => {
		expect(() => taperDate.setDate(123 as any)).toThrow(
			'Invalid input type. Expected string or Date.'
		);
	});
});
