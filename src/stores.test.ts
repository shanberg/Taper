import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { appStore, INITIAL_STATE, type AppStore } from './stores';
import { get } from 'svelte/store';
import { PLACEHOLDER_SEGMENT, TEMPLATES } from './consts';
import { TaperDate } from './TaperDate';

describe('appStore', () => {
	beforeEach(() => {
		// Reset the state before each test
		appStore.reset();
	});

	test('initial state', () => {
		const expectedDate = new TaperDate();

		// verify initial state
		const afterState: AppState = get(appStore);
		expect(afterState.schedule.segments).toEqual([...TEMPLATES[Object.keys(TEMPLATES)[0]], PLACEHOLDER_SEGMENT]);
		expect(afterState.schedule.startDate).toEqual(expectedDate.toScheduleDate());
		expect(afterState.undoStack).toEqual([]);
		expect(afterState.redoStack).toEqual([]);
		expect(afterState.startDateInputValue).toBe(expectedDate.toYYYYMMDD());
	});

	test('editSegmentAtIndex', () => {
		// Create a new segment
		const newSegment = { dose: 99, daysForDose: 99 };

		// edit the segment
		appStore.editSegmentAtIndex(0, newSegment);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.segments[0]).toEqual(newSegment);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('changeStartDate', () => {
		const newDate = new TaperDate('2425-11-11');

		// change the date
		appStore.changeStartDate(newDate.toScheduleDate());

		// verify changes
		const afterState = get(appStore);
		const expectedDate = newDate;
		expect(afterState.schedule.startDate).toEqual(expectedDate.toScheduleDate());
		expect(afterState.startDateInputValue).toBe(expectedDate.toYYYYMMDD());
		expect(afterState.undoStack.length).toBe(1);
	});

	test('insertPlaceholderSegmentBeforeIndex at zero', () => {
		const indexToInsert = 0;
		const beforeState = get(appStore);

		// Insert a placeholder segment before index 0
		appStore.insertPlaceholderSegmentBeforeIndex(indexToInsert);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.segments[indexToInsert]).toEqual(PLACEHOLDER_SEGMENT);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('insertPlaceholderSegmentBeforeIndex at 3', () => {
		const indexToInsert = 3;

		// Insert a placeholder segment before index 3
		appStore.insertPlaceholderSegmentBeforeIndex(indexToInsert);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.segments[indexToInsert]).toEqual(PLACEHOLDER_SEGMENT);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('insertPlaceholderSegmentBeforeIndex before existing placeholder', () => {
		const startingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 4, daysForDose: 4 },
			{ dose: 0, daysForDose: 0 }, // placeholder
		]

		// get initial state
		const beforeState = get(appStore);

		let preparedAppState = beforeState;
		preparedAppState.schedule.segments = startingSegments;

		// set to test schedule
		appStore.set(preparedAppState);

		// verify changes
		// const afterState = get(appStore);
		// expect(afterState.schedule.segments).toEqual(startingSegments);
	});

	test('switchTemplate', () => {
		// Get a new template to change to
		const newTemplateKey = Object.keys(TEMPLATES)[0];

		// switch to the new template
		appStore.switchTemplate(newTemplateKey);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.segments).toEqual(expect.arrayContaining(TEMPLATES[newTemplateKey]));
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('deleteSegmentAtIndex', () => {
		const beforeState = get(appStore);
		// pick a segment to delete
		const segmentIndex = 0;

		// set its content to something unique
		const testSegment = { dose: 99, daysForDose: 99 };

		// edit the segment
		appStore.editSegmentAtIndex(segmentIndex, testSegment);

		// verify that segment was edited
		const afterState1 = get(appStore);
		expect(afterState1.schedule.segments[segmentIndex]).toEqual(testSegment);
		expect(afterState1.undoStack.length).toBe(1);
		expect(afterState1.redoStack).toEqual([]);

		// then delete the segment
		appStore.deleteSegmentAtIndex(segmentIndex);

		// and verify it's deleted
		const afterState2 = get(appStore);
		expect(
			afterState2.schedule.segments.find(
				(s: Segment) => s.dose === testSegment.dose && s.daysForDose === testSegment.daysForDose
			)
		).toBeUndefined();
		expect(afterState2.undoStack.length).toBe(2);
		expect(afterState2.redoStack).toEqual([]);
	});

	test('undo', () => {
		appStore.reset();
		// make a bunch of changes
		appStore.insertPlaceholderSegmentBeforeIndex(3); // 1
		appStore.deleteSegmentAtIndex(2); // 2
		appStore.editSegmentAtIndex(3, { dose: 33, daysForDose: 12 }); // 3
		appStore.insertPlaceholderSegmentBeforeIndex(4); // 4
		appStore.editSegmentAtIndex(4, { dose: 33, daysForDose: 10 }); // 5
		appStore.editSegmentAtIndex(4, { dose: 33, daysForDose: 19 }); // 6
		appStore.insertPlaceholderSegmentBeforeIndex(1); // 7

		const afterState1 = get(appStore);
		expect(afterState1.undoStack.length).toEqual(7)

		// undo them all
		appStore.undo() // 1
		appStore.undo() // 2
		appStore.undo() // 3
		appStore.undo() // 4
		appStore.undo() // 5
		appStore.undo() // 6
		appStore.undo() // 7

		const afterState2 = get(appStore);
		expect(afterState2).toEqual(INITIAL_STATE);
	});

	// test('redo', () => {
	//     const initialSegment = { /* segment details */ };
	//     appStore.editSegmentAtIndex(0, initialSegment);
	//     appStore.undo();
	//     appStore.redo();

	//     const afterState = get(appStore);
	//     expect(afterState.schedule.segments[0]).toEqual(initialSegment);
	//     expect(afterState.undoStack.length).toBe(1);
	// });
});
