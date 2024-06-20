import { describe, test, expect, beforeEach } from 'vitest';
import { appStore, INITIAL_STORE_STATE } from './stores';
import { get } from 'svelte/store';
import { PLACEHOLDER_SEGMENT, TEMPLATES } from './consts';
import { TaperDate } from './TaperDate';
import { isSegmentPlaceholder, serializeSchedule } from './utils';

describe('appStore', () => {
	beforeEach(() => {
		// Reset the state before each test
		// appStore.set(INITIAL_STORE_STATE);
		appStore.reset();
	});

	test('initial state', () => {
		const now = new TaperDate();

		// verify initial state
		const afterState: AppState = get(appStore);

		// segments are from the template
		expect(afterState.schedule.segments).toEqual([...TEMPLATES[Object.keys(TEMPLATES)[0]], PLACEHOLDER_SEGMENT]);

		// start date is now-ish
		expect(afterState.schedule.startDate).toEqual(now.toScheduleDate());
		expect(afterState.startDateInputValue).toBe(now.toYYYYMMDD());

		// undo and redo are empty
		expect(afterState.undoStack).toEqual([]);
		expect(afterState.redoStack).toEqual([]);
	});

	test('editSegmentAtIndex 0', () => {
		const initialSchedule = serializeSchedule(get(appStore).schedule)
		const indexToUpdate = 0;

		// Create a new segment
		const updatedSegment = { dose: 99, daysForDose: 99 };

		// edit the segment
		appStore.editSegmentAtIndex(indexToUpdate, updatedSegment);

		// verify changes
		const afterState = get(appStore);

		// verify segment has been updated
		expect(afterState.schedule.segments[indexToUpdate]).toEqual(updatedSegment);

		// verify undo stack has previous state
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.undoStack[0]).toEqual(initialSchedule)

		// verify redo stack still empty
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

		// Insert a placeholder segment before index 0
		appStore.insertPlaceholderSegmentBeforeIndex(indexToInsert);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.segments[indexToInsert]).toEqual(PLACEHOLDER_SEGMENT);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('insertPlaceholderSegmentBeforeIndex before existing placeholder', () => {
		// prepare test data 
		const startingSegments = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 4, daysForDose: 4 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 }, // 4 - end placeholder
		]

		const resultingSegments = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 0, daysForDose: 0 }, // 3 - added placeholder
			{ dose: 4, daysForDose: 4 }, // 4 - inserted before here
			{ dose: 0, daysForDose: 0 }, // 5 - end placeholder
		];

		// prepare initial state
		const beforeState = get(appStore);
		let preparedAppState = beforeState;
		preparedAppState.schedule.segments = startingSegments;
		appStore.set(preparedAppState);

		// insert the placeholder
		appStore.insertPlaceholderSegmentBeforeIndex(3)

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.segments).toEqual(resultingSegments);
	});

	test('insertPlaceholderSegmentBeforeIndex after existing placeholder', () => {
		// prepare test data 
		const startingSegments = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 0, daysForDose: 0 }, // 1 - inner placeholder
			{ dose: 2, daysForDose: 2 }, // 2
			{ dose: 3, daysForDose: 3 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 }, // 4 - end placeholder
		]

		const resultingSegments = [
			{ dose: 1, daysForDose: 1 }, // 0
			// placeholder removed
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 0, daysForDose: 0 }, // 2 - placeholder added
			{ dose: 3, daysForDose: 3 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 }, // 4 - end placeholder
		];

		// prepare initial state
		const beforeState = get(appStore);
		let preparedAppState = beforeState;
		preparedAppState.schedule.segments = startingSegments;
		appStore.set(preparedAppState);

		// insert the placeholder
		appStore.insertPlaceholderSegmentBeforeIndex(3)

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.segments).toEqual(resultingSegments);
	});

	test('insertPlaceholderSegmentBeforeIndex then delete placeholder', () => {
		// prepare test data 
		const startingSegments = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 4, daysForDose: 4 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 }, // 4 
		]

		const afterAddingPlaceholder = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 0, daysForDose: 0 }, // 3 - added placeholder
			{ dose: 4, daysForDose: 4 }, // 4
			{ dose: 0, daysForDose: 0 }, // 5 - end placeholder
		];

		const afterDeletingPlaceholder = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			// removed
			{ dose: 4, daysForDose: 4 }, // 3
			{ dose: 0, daysForDose: 0 }, // 4 - end placeholder
		];

		// prepare initial state
		const beforeState = get(appStore);
		let preparedAppState = beforeState;
		preparedAppState.schedule.segments = startingSegments;
		appStore.set(preparedAppState);

		// insert the placeholder
		appStore.insertPlaceholderSegmentBeforeIndex(3)

		// verify changes 1
		const afterAdding = get(appStore);
		expect(afterAdding.schedule.segments).toEqual(afterAddingPlaceholder);

		// insert the placeholder
		appStore.deleteSegmentAtIndex(3)

		// verify changes 2
		const afterDeleting = get(appStore);
		expect(afterDeleting.schedule.segments).toEqual(afterDeletingPlaceholder);
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
		const initialState = get(appStore);

		// increment a segment a few times
		appStore.editSegmentAtIndex(1, { dose: 1, daysForDose: 1 }); // 1
		const after1 = get(appStore);
		expect(after1.undoStack.length).toEqual(1);
		appStore.editSegmentAtIndex(1, { dose: 2, daysForDose: 1 }); // 2
		const after2 = get(appStore);
		expect(after2.undoStack.length).toEqual(2);
		appStore.editSegmentAtIndex(1, { dose: 3, daysForDose: 1 }); // 3
		const after3 = get(appStore);
		expect(after3.undoStack.length).toEqual(3);

		const editedAppStore = get(appStore);
		expect(editedAppStore.schedule.segments[1]).toEqual({ dose: 3, daysForDose: 1 });

		appStore.undo(); // first undo
		const afterUndo1 = get(appStore);
		expect(afterUndo1.schedule.segments[1]).toEqual({ dose: 2, daysForDose: 1 });

		appStore.undo(); // second undo
		const afterUndo2 = get(appStore);
		expect(afterUndo2.schedule.segments[1]).toEqual({ dose: 1, daysForDose: 1 });
	});


	test('undo', () => {
		// prepare test data 
		const startingSegments = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 2
			{ dose: 3, daysForDose: 3 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 }, // 4 - end placeholder
		]

		// prepare initial state
		let preparedAppState = INITIAL_STORE_STATE;
		preparedAppState.schedule.segments = startingSegments;
		appStore.set(preparedAppState);

		const initialState = get(appStore);
		expect(initialState.schedule.segments).toEqual(startingSegments);


		// make a bunch of changes
		appStore.insertPlaceholderSegmentBeforeIndex(3); // 1
		const afterInsertPlaceholder = get(appStore);
		expect(afterInsertPlaceholder.schedule.segments.filter(s => isSegmentPlaceholder(s)).length).toEqual(2)

		appStore.deleteSegmentAtIndex(2); // 2
		const afterDeleteSegment = get(appStore);
		expect(afterDeleteSegment.schedule.segments.filter(s => isSegmentPlaceholder(s)).length).toEqual(2)

		appStore.editSegmentAtIndex(3, { dose: 33, daysForDose: 12 }); // 3
		const afterEditSegment = get(appStore);
		expect(afterEditSegment.schedule.segments.filter(s => isSegmentPlaceholder(s)).length).toEqual(1)

		appStore.insertPlaceholderSegmentBeforeIndex(4); // 4
		const afterInsertPlaceholder2 = get(appStore);
		expect(afterInsertPlaceholder2.schedule.segments.filter(s => isSegmentPlaceholder(s)).length).toEqual(2)

		appStore.editSegmentAtIndex(4, { dose: 33, daysForDose: 10 }); // 5
		const afterEditSegment2 = get(appStore);
		expect(afterEditSegment2.schedule.segments.filter(s => isSegmentPlaceholder(s)).length).toEqual(1)

		appStore.editSegmentAtIndex(4, { dose: 33, daysForDose: 19 }); // 6
		const afterEditSegment3 = get(appStore);
		expect(afterEditSegment3.schedule.segments.filter(s => isSegmentPlaceholder(s)).length).toEqual(1)

		appStore.insertPlaceholderSegmentBeforeIndex(1); // 7
		const afterInsertPlaceholder3 = get(appStore);
		expect(afterInsertPlaceholder3.schedule.segments.filter(s => isSegmentPlaceholder(s)).length).toEqual(2)

		const afterChanges = get(appStore);
		expect(afterChanges.undoStack.length).toEqual(7) // 7 undos built up

		// undo them all
		appStore.undo() // -6
		const afterUndo1 = get(appStore);
		expect(afterUndo1.schedule).toEqual(afterEditSegment3.schedule)

		appStore.undo() // -5
		const afterUndo2 = get(appStore);
		expect(afterUndo2.schedule).toEqual(afterEditSegment2.schedule)

		appStore.undo() // -4
		const afterUndo3 = get(appStore);
		expect(afterUndo3.schedule).toEqual(afterInsertPlaceholder2.schedule)

		appStore.undo() // -3
		const afterUndo4 = get(appStore);
		expect(afterUndo4.schedule).toEqual(afterEditSegment.schedule)

		appStore.undo() // -2
		const afterUndo5 = get(appStore);
		expect(afterUndo5.schedule).toEqual(afterDeleteSegment.schedule)

		appStore.undo() // -1
		const afterUndo6 = get(appStore);
		expect(afterUndo6.schedule).toEqual(afterInsertPlaceholder.schedule)

		appStore.undo() // 0 // initial
		const afterUndo7 = get(appStore);
		expect(afterUndo7.schedule).toEqual(INITIAL_STORE_STATE.schedule);
		expect(afterUndo7.undoStack.length).toEqual(0); // no more undos to undo
		expect(afterUndo7.schedule.segments[0]).toEqual(INITIAL_STORE_STATE.schedule.segments[0]);
		expect(afterUndo7.schedule).toEqual(INITIAL_STORE_STATE.schedule);
		expect(afterUndo7.startDateInputValue).toEqual(INITIAL_STORE_STATE.startDateInputValue);
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
