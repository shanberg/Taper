import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { appState } from './stores';
import { get } from 'svelte/store';
import { PLACEHOLDER_SEGMENT, TEMPLATES } from './consts';
import { TaperDate } from './TaperDate';


describe('appState', () => {
	let unsubscribe = () => { };

	beforeEach(() => {
		// Reset the state before each test
		unsubscribe = appState.subscribe(() => { });
		const startDate = new TaperDate();
		appState.set({
			schedule: {
				segments: TEMPLATES[Object.keys(TEMPLATES)[0]],
				startDate
			},
			undoStack: [],
			redoStack: [],
			startDateInputValue: startDate.toYYYYMMDD()
		});
	});

	afterEach(() => {
		unsubscribe();
	});

	test('initial state', () => {
		const expectedDate = new TaperDate();

		// verify initial state
		const afterState: AppState = get(appState);
		expect(afterState.schedule.segments).toEqual(TEMPLATES[Object.keys(TEMPLATES)[0]]);
		expect(afterState.schedule.startDate).toEqual(expectedDate);
		expect(afterState.undoStack).toEqual([]);
		expect(afterState.redoStack).toEqual([]);
		expect(afterState.startDateInputValue).toBe(expectedDate.toYYYYMMDD());
	});

	test('editSegmentAtIndex', () => {
		// Create a new segment
		const newSegment = { dose: 99, daysForDose: 99 };

		// edit the segment
		appState.editSegmentAtIndex(0, newSegment);

		// verify changes
		const afterState: AppState = get(appState);
		expect(afterState.schedule.segments[0]).toEqual(newSegment);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('changeStartDate', () => {
		const newDate = new TaperDate('2425-11-11');

		// change the date
		appState.changeStartDate(newDate.toScheduleDate());

		// verify changes
		const afterState: AppState = get(appState);
		const expectedDate = newDate;
		expect(afterState.schedule.startDate).toEqual(expectedDate.toScheduleDate());
		expect(afterState.startDateInputValue).toBe(expectedDate.toYYYYMMDD());
		expect(afterState.undoStack.length).toBe(1);
	});

	test('insertPlaceholderSegmentBeforeIndex at zero', () => {
		const indexToInsert = 0;

		// Insert a placeholder segment before index 0
		appState.insertPlaceholderSegmentBeforeIndex(indexToInsert);

		// verify changes
		const afterState: AppState = get(appState);
		expect(afterState.schedule.segments[indexToInsert]).toEqual(PLACEHOLDER_SEGMENT);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('insertPlaceholderSegmentBeforeIndex at 3', () => {
		const indexToInsert = 3;

		// Insert a placeholder segment before index 3
		appState.insertPlaceholderSegmentBeforeIndex(indexToInsert);

		// verify changes
		const afterState: AppState = get(appState);
		expect(afterState.schedule.segments[indexToInsert]).toEqual(PLACEHOLDER_SEGMENT);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('insertPlaceholderSegmentBeforeIndex at end', () => {
		const initialState: AppState = get(appState);
		const indexToInsert = initialState.schedule.segments.length;

		// Insert a placeholder segment before last index
		appState.insertPlaceholderSegmentBeforeIndex(indexToInsert);

		// verify changes
		const afterState: AppState = get(appState);
		expect(afterState.schedule.segments[indexToInsert]).toEqual(PLACEHOLDER_SEGMENT);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('switchTemplate', () => {
		// Get a new template to change to
		const newTemplateKey = Object.keys(TEMPLATES)[0];

		// switch to the new template
		appState.switchTemplate(newTemplateKey);

		// verify changes
		const afterState: AppState = get(appState);
		expect(afterState.schedule.segments).toEqual(expect.arrayContaining(TEMPLATES[newTemplateKey]));
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('deleteSegmentAtIndex', () => {
		// pick a segment to delete
		const segmentIndex = 0;

		// set its content to something unique
		const testSegment = { dose: 99, daysForDose: 99 };

		// edit the segment
		appState.editSegmentAtIndex(segmentIndex, testSegment);

		// verify that segment was edited
		const afterState1: AppState = get(appState);
		expect(afterState1.schedule.segments[segmentIndex]).toEqual(testSegment);
		expect(afterState1.undoStack.length).toBe(1);
		expect(afterState1.redoStack).toEqual([]);

		// then delete the segment
		appState.deleteSegmentAtIndex(segmentIndex);

		// and verify it's deleted
		const afterState2: AppState = get(appState);
		expect(
			afterState2.schedule.segments.find(
				(s: Segment) => s.dose === testSegment.dose && s.daysForDose === testSegment.daysForDose
			)
		).toBeUndefined();
		expect(afterState2.undoStack.length).toBe(2);
		expect(afterState2.redoStack).toEqual([]);
	});

	// test('undo', () => {

	//     const initialSegment = { /* segment details */ };
	//     appState.editSegmentAtIndex(0, initialSegment);
	//     appState.undo();

	//     const afterState: AppState = get(appState);
	//     expect(afterState.schedule.segments[0]).not.toEqual(initialSegment);
	//     expect(afterState.redoStack.length).toBe(1);
	// });

	// test('redo', () => {
	//     const initialSegment = { /* segment details */ };
	//     appState.editSegmentAtIndex(0, initialSegment);
	//     appState.undo();
	//     appState.redo();

	//     const afterState: AppState = get(appState);
	//     expect(afterState.schedule.segments[0]).toEqual(initialSegment);
	//     expect(afterState.undoStack.length).toBe(1);
	// });
});
