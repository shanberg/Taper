/**
 * @fileoverview Tests for appStore: initialization, editSegmentAtIndex, changeStartDate,
 * insertPlaceholderSegmentBeforeIndex, switchTemplate, deleteSegmentAtIndex, undo, and redo.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { appStore, createAppStore, INITIAL_STORE_STATE } from './stores';
import { get } from 'svelte/store';
import { PLACEHOLDER_SEGMENT, TEMPLATES } from './consts';
import { TaperDate } from './TaperDate';
import { isSegmentPlaceholder, serializeSchedule } from './utils';

/**
 * Registers a beforeEach that resets the app store before each test in the current describe.
 * @returns void
 */
function resetStore() {
	beforeEach(() => appStore.reset());
}

/** Suite: appStore initialization and initial state. */
describe('appStore initialization', () => {
	resetStore();

	test('appStore initialization', () => {
		const store = createAppStore();
		const initialState = get(store);
		expect(initialState).toEqual(INITIAL_STORE_STATE);
		expect(typeof store.editSegmentAtIndex).toBe('function');
		expect(typeof store.changeStartDate).toBe('function');
		expect(typeof store.insertPlaceholderSegmentBeforeIndex).toBe('function');
		expect(typeof store.deleteSegmentAtIndex).toBe('function');
		expect(typeof store.switchTemplate).toBe('function');
		expect(typeof store.undo).toBe('function');
		expect(typeof store.redo).toBe('function');
		expect(typeof store.reset).toBe('function');
	});

	test('initial state', () => {
		const now = new TaperDate();
		const afterState: AppState = get(appStore);
		expect(afterState.schedule.segments).toEqual([
			...TEMPLATES[Object.keys(TEMPLATES)[0]],
			PLACEHOLDER_SEGMENT
		]);
		expect(afterState.schedule.startDate).toEqual(now.toScheduleDate());
		expect(afterState.startDateInputValue).toBe(now.toYYYYMMDD());
		expect(afterState.undoStack).toEqual([]);
		expect(afterState.redoStack).toEqual([]);
	});
});

/** Suite: editSegmentAtIndex updates segment, pushes undo, clears redo. */
describe('appStore editSegmentAtIndex', () => {
	resetStore();

	test('editSegmentAtIndex 0', () => {
		const initialSchedule = serializeSchedule(get(appStore).schedule);
		const indexToUpdate = 0;
		const updatedSegment = { dose: 99, daysForDose: 99 };
		appStore.editSegmentAtIndex(indexToUpdate, { ...updatedSegment });
		const afterState = get(appStore);
		expect(afterState.schedule.segments[indexToUpdate]).toEqual(updatedSegment);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.undoStack[0]).toEqual(initialSchedule);
		expect(afterState.redoStack).toEqual([]);
	});

	test('editSegmentAtIndex last index when it was a placeholder', () => {
		const startingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 4, daysForDose: 4 },
			{ dose: 0, daysForDose: 0 }
		];
		const resultingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 4, daysForDose: 4 },
			{ dose: 1, daysForDose: 0 },
			{ dose: 0, daysForDose: 0 }
		];
		const beforeState = get(appStore);
		const preparedAppState = { ...beforeState, schedule: { ...beforeState.schedule, segments: startingSegments } };
		appStore.set(preparedAppState);
		appStore.editSegmentAtIndex(4, { dose: 1, daysForDose: 0 });
		const afterState = get(appStore);
		expect(afterState.schedule.segments).toEqual(resultingSegments);
	});
});

/** Suite: changeStartDate updates schedule.startDate and startDateInputValue. */
describe('appStore changeStartDate', () => {
	resetStore();

	test('changeStartDate', () => {
		const newDate = new TaperDate('2425-11-11');
		appStore.changeStartDate(newDate.toScheduleDate());
		const afterState = get(appStore);
		expect(afterState.schedule.startDate).toEqual(newDate.toScheduleDate());
		expect(afterState.startDateInputValue).toBe(newDate.toYYYYMMDD());
		expect(afterState.undoStack.length).toBe(1);
	});
});

/** Suite: insertPlaceholderSegmentBeforeIndex and placeholder ordering. */
describe('appStore insertPlaceholderSegmentBeforeIndex', () => {
	resetStore();

	test('insertPlaceholderSegmentBeforeIndex at zero', () => {
		appStore.insertPlaceholderSegmentBeforeIndex(0);
		const afterState = get(appStore);
		expect(afterState.schedule.segments[0]).toEqual(PLACEHOLDER_SEGMENT);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('insertPlaceholderSegmentBeforeIndex before existing placeholder', () => {
		const startingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 4, daysForDose: 4 },
			{ dose: 0, daysForDose: 0 }
		];
		const resultingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 0, daysForDose: 0 },
			{ dose: 4, daysForDose: 4 },
			{ dose: 0, daysForDose: 0 }
		];
		const beforeState = get(appStore);
		const preparedAppState = { ...beforeState, schedule: { ...beforeState.schedule, segments: startingSegments } };
		appStore.set(preparedAppState);
		appStore.insertPlaceholderSegmentBeforeIndex(3);
		const afterState = get(appStore);
		expect(afterState.schedule.segments).toEqual(resultingSegments);
	});

	test('insertPlaceholderSegmentBeforeIndex after existing placeholder', () => {
		const startingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 0, daysForDose: 0 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 0, daysForDose: 0 }
		];
		const resultingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 0, daysForDose: 0 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 0, daysForDose: 0 }
		];
		const beforeState = get(appStore);
		const preparedAppState = { ...beforeState, schedule: { ...beforeState.schedule, segments: startingSegments } };
		appStore.set(preparedAppState);
		appStore.insertPlaceholderSegmentBeforeIndex(3);
		const afterState = get(appStore);
		expect(afterState.schedule.segments).toEqual(resultingSegments);
	});

	test('insertPlaceholderSegmentBeforeIndex then delete placeholder', () => {
		const startingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 4, daysForDose: 4 },
			{ dose: 0, daysForDose: 0 }
		];
		const afterAddingPlaceholder = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 0, daysForDose: 0 },
			{ dose: 4, daysForDose: 4 },
			{ dose: 0, daysForDose: 0 }
		];
		const afterDeletingPlaceholder = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 4, daysForDose: 4 },
			{ dose: 0, daysForDose: 0 }
		];
		const beforeState = get(appStore);
		const preparedAppState = { ...beforeState, schedule: { ...beforeState.schedule, segments: startingSegments } };
		appStore.set(preparedAppState);
		appStore.insertPlaceholderSegmentBeforeIndex(3);
		const afterAdding = get(appStore);
		expect(afterAdding.schedule.segments).toEqual(afterAddingPlaceholder);
		appStore.deleteSegmentAtIndex(3);
		const afterDeleting = get(appStore);
		expect(afterDeleting.schedule.segments).toEqual(afterDeletingPlaceholder);
	});
});

/** Suite: switchTemplate replaces segments and updates templateKey. */
describe('appStore switchTemplate', () => {
	resetStore();

	test('switchTemplate', () => {
		const newTemplateKey = Object.keys(TEMPLATES)[0];
		appStore.switchTemplate(newTemplateKey);
		const afterState = get(appStore);
		expect(afterState.schedule.segments).toEqual(expect.arrayContaining(TEMPLATES[newTemplateKey]));
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});
});

/** Suite: deleteSegmentAtIndex removes segment and pushes undo. */
describe('appStore deleteSegmentAtIndex', () => {
	resetStore();

	test('deleteSegmentAtIndex', () => {
		const segmentIndex = 0;
		const testSegment = { dose: 99, daysForDose: 99 };
		appStore.editSegmentAtIndex(segmentIndex, testSegment);
		const afterState1 = get(appStore);
		expect(afterState1.schedule.segments[segmentIndex]).toEqual(testSegment);
		expect(afterState1.undoStack.length).toBe(1);
		expect(afterState1.redoStack).toEqual([]);
		appStore.deleteSegmentAtIndex(segmentIndex);
		const afterState2 = get(appStore);
		expect(
			afterState2.schedule.segments.find(
				(s: Segment) => s.dose === testSegment.dose && s.daysForDose === testSegment.daysForDose
			)
		).toBeUndefined();
		expect(afterState2.undoStack.length).toBe(2);
		expect(afterState2.redoStack).toEqual([]);
	});
});

/** Suite: undo restores previous state from undo stack. */
describe('appStore undo', () => {
	resetStore();

	test('undo', () => {
		appStore.editSegmentAtIndex(1, { dose: 1, daysForDose: 1 });
		expect(get(appStore).undoStack.length).toEqual(1);
		appStore.editSegmentAtIndex(1, { dose: 2, daysForDose: 1 });
		expect(get(appStore).undoStack.length).toEqual(2);
		appStore.editSegmentAtIndex(1, { dose: 3, daysForDose: 1 });
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 3, daysForDose: 1 });
		appStore.undo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 2, daysForDose: 1 });
		appStore.undo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 1, daysForDose: 1 });
	});

	test('undo through many steps', () => {
		const startingSegments = [
			{ dose: 1, daysForDose: 1 },
			{ dose: 2, daysForDose: 2 },
			{ dose: 3, daysForDose: 3 },
			{ dose: 0, daysForDose: 0 }
		];
		const initialScheduleForTest = { ...INITIAL_STORE_STATE.schedule, segments: startingSegments };
		const preparedAppState = { ...INITIAL_STORE_STATE, schedule: initialScheduleForTest };
		appStore.set(preparedAppState);
		expect(get(appStore).schedule.segments).toEqual(startingSegments);

		appStore.insertPlaceholderSegmentBeforeIndex(3);
		const afterInsertPlaceholder = get(appStore);
		expect(afterInsertPlaceholder.schedule.segments.filter((s) => isSegmentPlaceholder(s)).length).toEqual(2);

		appStore.deleteSegmentAtIndex(2);
		const afterDeleteSegment = get(appStore);
		expect(afterDeleteSegment.schedule.segments.filter((s) => isSegmentPlaceholder(s)).length).toEqual(2);

		appStore.editSegmentAtIndex(3, { dose: 33, daysForDose: 12 });
		const afterEditSegment = get(appStore);
		expect(afterEditSegment.schedule.segments.filter((s) => isSegmentPlaceholder(s)).length).toEqual(1);

		appStore.insertPlaceholderSegmentBeforeIndex(4);
		const afterInsertPlaceholder2 = get(appStore);
		expect(afterInsertPlaceholder2.schedule.segments.filter((s) => isSegmentPlaceholder(s)).length).toEqual(2);

		appStore.editSegmentAtIndex(4, { dose: 33, daysForDose: 10 });
		const afterEditSegment2 = get(appStore);
		expect(afterEditSegment2.schedule.segments.filter((s) => isSegmentPlaceholder(s)).length).toEqual(1);

		appStore.editSegmentAtIndex(4, { dose: 33, daysForDose: 19 });
		const afterEditSegment3 = get(appStore);
		expect(afterEditSegment3.schedule.segments.filter((s) => isSegmentPlaceholder(s)).length).toEqual(1);

		appStore.insertPlaceholderSegmentBeforeIndex(1);
		expect(get(appStore).undoStack.length).toEqual(7);

		appStore.undo();
		expect(get(appStore).schedule).toEqual(afterEditSegment3.schedule);
		appStore.undo();
		expect(get(appStore).schedule).toEqual(afterEditSegment2.schedule);
		appStore.undo();
		expect(get(appStore).schedule).toEqual(afterInsertPlaceholder2.schedule);
		appStore.undo();
		expect(get(appStore).schedule).toEqual(afterEditSegment.schedule);
		appStore.undo();
		expect(get(appStore).schedule).toEqual(afterDeleteSegment.schedule);
		appStore.undo();
		expect(get(appStore).schedule).toEqual(afterInsertPlaceholder.schedule);
		appStore.undo();
		const afterUndo7 = get(appStore);
		expect(afterUndo7.schedule).toEqual(initialScheduleForTest);
		expect(afterUndo7.undoStack.length).toEqual(0);
		expect(afterUndo7.startDateInputValue).toEqual(INITIAL_STORE_STATE.startDateInputValue);
	});

	test('undo returns current state when undoStack is empty', () => {
		const initialState: AppState = get(appStore);
		appStore.undo();
		expect(get(appStore)).toEqual(initialState);
	});
});

/** Suite: redo reapplies state from redo stack. */
describe('appStore redo', () => {
	resetStore();

	test('redo', () => {
		appStore.editSegmentAtIndex(1, { dose: 1, daysForDose: 1 });
		expect(get(appStore).undoStack.length).toEqual(1);
		appStore.editSegmentAtIndex(1, { dose: 2, daysForDose: 1 });
		appStore.editSegmentAtIndex(1, { dose: 3, daysForDose: 1 });
		appStore.undo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 2, daysForDose: 1 });
		expect(get(appStore).redoStack.length).toEqual(1);
		appStore.undo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 1, daysForDose: 1 });
		expect(get(appStore).redoStack.length).toEqual(2);
		appStore.redo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 2, daysForDose: 1 });
		expect(get(appStore).redoStack.length).toEqual(1);
		appStore.redo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 3, daysForDose: 1 });
		expect(get(appStore).redoStack.length).toEqual(0);
	});

	test('redo after multiple undos', () => {
		const initialState = get(appStore);
		appStore.editSegmentAtIndex(1, { dose: 1, daysForDose: 1 });
		appStore.editSegmentAtIndex(1, { dose: 2, daysForDose: 1 });
		appStore.editSegmentAtIndex(1, { dose: 3, daysForDose: 1 });
		appStore.undo();
		appStore.undo();
		appStore.undo();
		const afterUndoAll = get(appStore);
		expect(afterUndoAll.schedule.segments[1]).toEqual(initialState.schedule.segments[1]);
		expect(afterUndoAll.redoStack.length).toEqual(3);
		appStore.redo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 1, daysForDose: 1 });
		appStore.redo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 2, daysForDose: 1 });
		appStore.redo();
		expect(get(appStore).schedule.segments[1]).toEqual({ dose: 3, daysForDose: 1 });
		expect(get(appStore).redoStack.length).toEqual(0);
	});

	test('redo returns current state when redoStack is empty', () => {
		appStore.editSegmentAtIndex(0, { dose: 5, daysForDose: 10 });
		appStore.undo();
		appStore.redo();
		const stateBeforeExtraRedo: AppState = get(appStore);
		appStore.redo();
		expect(get(appStore)).toEqual(stateBeforeExtraRedo);
	});
});
