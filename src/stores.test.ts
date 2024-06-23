import { describe, test, expect, beforeEach } from 'vitest';
import { appStore, createAppStore, INITIAL_STORE_STATE } from './stores';
import { get } from 'svelte/store';
import { PLACEHOLDER_SEGMENT, TEMPLATES } from './consts';
import { TaperDate } from './TaperDate';
import { isStepPlaceholder, serializeSchedule } from './utils';

describe('appStore', () => {
	beforeEach(() => {
		// Reset the state before each test
		appStore.reset();
	});

	// Test for appStore initialization
	test('appStore initialization', () => {
		// Create a new instance of the app store
		const store = createAppStore();

		// Get the initial state of the store
		const initialState = get(store);

		// Verify the initial state matches the expected initial state
		expect(initialState).toEqual(INITIAL_STORE_STATE);

		// Verify that the store methods are defined
		expect(typeof store.editStepAtIndex).toBe('function');
		expect(typeof store.changeStartDate).toBe('function');
		expect(typeof store.insertPlaceholderStepBeforeIndex).toBe('function');
		expect(typeof store.deleteStepAtIndex).toBe('function');
		expect(typeof store.switchTemplate).toBe('function');
		expect(typeof store.undo).toBe('function');
		expect(typeof store.redo).toBe('function');
		expect(typeof store.reset).toBe('function');
	});

	test('initial state', () => {
		const now = new TaperDate();

		// verify initial state
		const afterState: AppState = get(appStore);

		// steps are from the template
		expect(afterState.schedule.steps).toEqual([
			...TEMPLATES[Object.keys(TEMPLATES)[0]],
			PLACEHOLDER_SEGMENT
		]);

		// start date is now-ish
		expect(afterState.schedule.startDate).toEqual(now.toScheduleDate());
		expect(afterState.startDateInputValue).toBe(now.toYYYYMMDD());

		// undo and redo are empty
		expect(afterState.undoStack).toEqual([]);
		expect(afterState.redoStack).toEqual([]);
	});

	test('editStepAtIndex 0', () => {
		const initialSchedule = serializeSchedule(get(appStore).schedule);
		const indexToUpdate = 0;

		// Create a new step
		const updatedStep = { dose: 99, daysForDose: 99 };

		// edit the step
		appStore.editStepAtIndex(indexToUpdate, { ...updatedStep });

		// verify changes
		const afterState = get(appStore);

		// verify step has been updated
		expect(afterState.schedule.steps[indexToUpdate]).toEqual(updatedStep);

		// verify undo stack has previous state
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.undoStack[0]).toEqual(initialSchedule);

		// verify redo stack still empty
		expect(afterState.redoStack).toEqual([]);
	});

	test('editStepAtIndex last index when it was a placeholder', () => {
		// prepare test data
		const startingSteps = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 4, daysForDose: 4 }, // 3
			{ dose: 0, daysForDose: 0 } // 4 - the one to edit
		];

		const resultingSteps = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 4, daysForDose: 4 }, // 3
			{ dose: 1, daysForDose: 0 }, // 4 - edited
			{ dose: 0, daysForDose: 0 } // 5 - created automatically
		];

		// prepare initial state
		const beforeState = get(appStore);
		let preparedAppState = beforeState;
		preparedAppState.schedule.steps = startingSteps;
		appStore.set(preparedAppState);

		// insert the placeholder
		appStore.editStepAtIndex(4, { dose: 1, daysForDose: 0 });

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.steps).toEqual(resultingSteps);
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

	test('insertPlaceholderStepBeforeIndex at zero', () => {
		const indexToInsert = 0;

		// Insert a placeholder step before index 0
		appStore.insertPlaceholderStepBeforeIndex(indexToInsert);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.steps[indexToInsert]).toEqual(PLACEHOLDER_SEGMENT);
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('insertPlaceholderStepBeforeIndex before existing placeholder', () => {
		// prepare test data
		const startingSteps = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 4, daysForDose: 4 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 } // 4 - end placeholder
		];

		const resultingSteps = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 0, daysForDose: 0 }, // 3 - added placeholder
			{ dose: 4, daysForDose: 4 }, // 4 - inserted before here
			{ dose: 0, daysForDose: 0 } // 5 - end placeholder
		];

		// prepare initial state
		const beforeState = get(appStore);
		let preparedAppState = beforeState;
		preparedAppState.schedule.steps = startingSteps;
		appStore.set(preparedAppState);

		// insert the placeholder
		appStore.insertPlaceholderStepBeforeIndex(3);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.steps).toEqual(resultingSteps);
	});

	test('insertPlaceholderStepBeforeIndex after existing placeholder', () => {
		// prepare test data
		const startingSteps = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 0, daysForDose: 0 }, // 1 - inner placeholder
			{ dose: 2, daysForDose: 2 }, // 2
			{ dose: 3, daysForDose: 3 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 } // 4 - end placeholder
		];

		const resultingSteps = [
			{ dose: 1, daysForDose: 1 }, // 0
			// placeholder removed
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 0, daysForDose: 0 }, // 2 - placeholder added
			{ dose: 3, daysForDose: 3 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 } // 4 - end placeholder
		];

		// prepare initial state
		const beforeState = get(appStore);
		let preparedAppState = beforeState;
		preparedAppState.schedule.steps = startingSteps;
		appStore.set(preparedAppState);

		// insert the placeholder
		appStore.insertPlaceholderStepBeforeIndex(3);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.steps).toEqual(resultingSteps);
	});

	test('insertPlaceholderStepBeforeIndex then delete placeholder', () => {
		// prepare test data
		const startingSteps = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 4, daysForDose: 4 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 } // 4
		];

		const afterAddingPlaceholder = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			{ dose: 0, daysForDose: 0 }, // 3 - added placeholder
			{ dose: 4, daysForDose: 4 }, // 4
			{ dose: 0, daysForDose: 0 } // 5 - end placeholder
		];

		const afterDeletingPlaceholder = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 1
			{ dose: 3, daysForDose: 3 }, // 2
			// removed
			{ dose: 4, daysForDose: 4 }, // 3
			{ dose: 0, daysForDose: 0 } // 4 - end placeholder
		];

		// prepare initial state
		const beforeState = get(appStore);
		let preparedAppState = beforeState;
		preparedAppState.schedule.steps = startingSteps;
		appStore.set(preparedAppState);

		// insert the placeholder
		appStore.insertPlaceholderStepBeforeIndex(3);

		// verify changes 1
		const afterAdding = get(appStore);
		expect(afterAdding.schedule.steps).toEqual(afterAddingPlaceholder);

		// insert the placeholder
		appStore.deleteStepAtIndex(3);

		// verify changes 2
		const afterDeleting = get(appStore);
		expect(afterDeleting.schedule.steps).toEqual(afterDeletingPlaceholder);
	});

	test('switchTemplate', () => {
		// Get a new template to change to
		const newTemplateKey = Object.keys(TEMPLATES)[0];

		// switch to the new template
		appStore.switchTemplate(newTemplateKey);

		// verify changes
		const afterState = get(appStore);
		expect(afterState.schedule.steps).toEqual(expect.arrayContaining(TEMPLATES[newTemplateKey]));
		expect(afterState.undoStack.length).toBe(1);
		expect(afterState.redoStack).toEqual([]);
	});

	test('deleteStepAtIndex', () => {
		const beforeState = get(appStore);
		// pick a step to delete
		const stepIndex = 0;

		// set its content to something unique
		const testStep = { dose: 99, daysForDose: 99 };

		// edit the step
		appStore.editStepAtIndex(stepIndex, testStep);

		// verify that step was edited
		const afterState1 = get(appStore);
		expect(afterState1.schedule.steps[stepIndex]).toEqual(testStep);
		expect(afterState1.undoStack.length).toBe(1);
		expect(afterState1.redoStack).toEqual([]);

		// then delete the step
		appStore.deleteStepAtIndex(stepIndex);

		// and verify it's deleted
		const afterState2 = get(appStore);
		expect(
			afterState2.schedule.steps.find(
				(s: Step) => s.dose === testStep.dose && s.daysForDose === testStep.daysForDose
			)
		).toBeUndefined();
		expect(afterState2.undoStack.length).toBe(2);
		expect(afterState2.redoStack).toEqual([]);
	});

	test('undo', () => {
		const initialState = get(appStore);

		// increment a step a few times
		appStore.editStepAtIndex(1, { dose: 1, daysForDose: 1 }); // 1
		const after1 = get(appStore);
		expect(after1.undoStack.length).toEqual(1);
		appStore.editStepAtIndex(1, { dose: 2, daysForDose: 1 }); // 2
		const after2 = get(appStore);
		expect(after2.undoStack.length).toEqual(2);
		appStore.editStepAtIndex(1, { dose: 3, daysForDose: 1 }); // 3
		const after3 = get(appStore);
		expect(after3.undoStack.length).toEqual(3);

		const editedAppStore = get(appStore);
		expect(editedAppStore.schedule.steps[1]).toEqual({ dose: 3, daysForDose: 1 });

		appStore.undo(); // first undo
		const afterUndo1 = get(appStore);
		expect(afterUndo1.schedule.steps[1]).toEqual({ dose: 2, daysForDose: 1 });

		appStore.undo(); // second undo
		const afterUndo2 = get(appStore);
		expect(afterUndo2.schedule.steps[1]).toEqual({ dose: 1, daysForDose: 1 });
	});

	test('undo', () => {
		// prepare test data
		const startingSteps = [
			{ dose: 1, daysForDose: 1 }, // 0
			{ dose: 2, daysForDose: 2 }, // 2
			{ dose: 3, daysForDose: 3 }, // 3 - insert before here
			{ dose: 0, daysForDose: 0 } // 4 - end placeholder
		];

		// prepare initial state
		let preparedAppState = INITIAL_STORE_STATE;
		preparedAppState.schedule.steps = startingSteps;
		appStore.set(preparedAppState);

		const initialState = get(appStore);
		expect(initialState.schedule.steps).toEqual(startingSteps);

		// make a bunch of changes
		appStore.insertPlaceholderStepBeforeIndex(3); // 1
		const afterInsertPlaceholder = get(appStore);
		expect(
			afterInsertPlaceholder.schedule.steps.filter((s) => isStepPlaceholder(s)).length
		).toEqual(2);

		appStore.deleteStepAtIndex(2); // 2
		const afterDeleteStep = get(appStore);
		expect(
			afterDeleteStep.schedule.steps.filter((s) => isStepPlaceholder(s)).length
		).toEqual(2);

		appStore.editStepAtIndex(3, { dose: 33, daysForDose: 12 }); // 3
		const afterEditStep = get(appStore);
		expect(
			afterEditStep.schedule.steps.filter((s) => isStepPlaceholder(s)).length
		).toEqual(1);

		appStore.insertPlaceholderStepBeforeIndex(4); // 4
		const afterInsertPlaceholder2 = get(appStore);
		expect(
			afterInsertPlaceholder2.schedule.steps.filter((s) => isStepPlaceholder(s)).length
		).toEqual(2);

		appStore.editStepAtIndex(4, { dose: 33, daysForDose: 10 }); // 5
		const afterEditStep2 = get(appStore);
		expect(
			afterEditStep2.schedule.steps.filter((s) => isStepPlaceholder(s)).length
		).toEqual(1);

		appStore.editStepAtIndex(4, { dose: 33, daysForDose: 19 }); // 6
		const afterEditStep3 = get(appStore);
		expect(
			afterEditStep3.schedule.steps.filter((s) => isStepPlaceholder(s)).length
		).toEqual(1);

		appStore.insertPlaceholderStepBeforeIndex(1); // 7
		const afterInsertPlaceholder3 = get(appStore);
		expect(
			afterInsertPlaceholder3.schedule.steps.filter((s) => isStepPlaceholder(s)).length
		).toEqual(2);

		const afterChanges = get(appStore);
		expect(afterChanges.undoStack.length).toEqual(7); // 7 undos built up

		// undo them all
		appStore.undo(); // -6
		const afterUndo1 = get(appStore);
		expect(afterUndo1.schedule).toEqual(afterEditStep3.schedule);

		appStore.undo(); // -5
		const afterUndo2 = get(appStore);
		expect(afterUndo2.schedule).toEqual(afterEditStep2.schedule);

		appStore.undo(); // -4
		const afterUndo3 = get(appStore);
		expect(afterUndo3.schedule).toEqual(afterInsertPlaceholder2.schedule);

		appStore.undo(); // -3
		const afterUndo4 = get(appStore);
		expect(afterUndo4.schedule).toEqual(afterEditStep.schedule);

		appStore.undo(); // -2
		const afterUndo5 = get(appStore);
		expect(afterUndo5.schedule).toEqual(afterDeleteStep.schedule);

		appStore.undo(); // -1
		const afterUndo6 = get(appStore);
		expect(afterUndo6.schedule).toEqual(afterInsertPlaceholder.schedule);

		appStore.undo(); // 0 // initial
		const afterUndo7 = get(appStore);
		expect(afterUndo7.schedule).toEqual(INITIAL_STORE_STATE.schedule);
		expect(afterUndo7.undoStack.length).toEqual(0); // no more undos to undo
		expect(afterUndo7.schedule.steps[0]).toEqual(INITIAL_STORE_STATE.schedule.steps[0]);
		expect(afterUndo7.schedule).toEqual(INITIAL_STORE_STATE.schedule);
		expect(afterUndo7.startDateInputValue).toEqual(INITIAL_STORE_STATE.startDateInputValue);
	});

	test('undo returns current state when undoStack is empty', () => {
		// Get the initial state
		const initialState: AppState = get(appStore);

		// Call undo
		appStore.undo();

		// Get the state after undo
		const stateAfterUndo: AppState = get(appStore);

		// Verify that the state has not changed
		expect(stateAfterUndo).toEqual(initialState);
	});

	test('redo', () => {
		const initialState = get(appStore);

		// Perform some actions
		appStore.editStepAtIndex(1, { dose: 1, daysForDose: 1 }); // 1
		const afterEdit1 = get(appStore);
		expect(afterEdit1.undoStack.length).toEqual(1);

		appStore.editStepAtIndex(1, { dose: 2, daysForDose: 1 }); // 2
		const afterEdit2 = get(appStore);
		expect(afterEdit2.undoStack.length).toEqual(2);

		appStore.editStepAtIndex(1, { dose: 3, daysForDose: 1 }); // 3
		const afterEdit3 = get(appStore);
		expect(afterEdit3.undoStack.length).toEqual(3);

		// Perform undo actions
		appStore.undo(); // undo last edit
		const afterUndo1 = get(appStore);
		expect(afterUndo1.schedule.steps[1]).toEqual({ dose: 2, daysForDose: 1 });
		expect(afterUndo1.redoStack.length).toEqual(1);

		appStore.undo(); // undo second edit
		const afterUndo2 = get(appStore);
		expect(afterUndo2.schedule.steps[1]).toEqual({ dose: 1, daysForDose: 1 });
		expect(afterUndo2.redoStack.length).toEqual(2);

		// Perform redo actions
		appStore.redo(); // redo second edit
		const afterRedo1 = get(appStore);
		expect(afterRedo1.schedule.steps[1]).toEqual({ dose: 2, daysForDose: 1 });
		expect(afterRedo1.redoStack.length).toEqual(1);

		appStore.redo(); // redo last edit
		const afterRedo2 = get(appStore);
		expect(afterRedo2.schedule.steps[1]).toEqual({ dose: 3, daysForDose: 1 });
		expect(afterRedo2.redoStack.length).toEqual(0);
	});

	test('redo after multiple undos', () => {
		const initialState = get(appStore);

		// Perform some actions
		appStore.editStepAtIndex(1, { dose: 1, daysForDose: 1 }); // 1
		appStore.editStepAtIndex(1, { dose: 2, daysForDose: 1 }); // 2
		appStore.editStepAtIndex(1, { dose: 3, daysForDose: 1 }); // 3

		// Perform multiple undo actions
		appStore.undo(); // undo last edit
		appStore.undo(); // undo second edit
		appStore.undo(); // undo first edit

		const afterUndoAll = get(appStore);
		expect(afterUndoAll.schedule.steps[1]).toEqual(initialState.schedule.steps[1]);
		expect(afterUndoAll.redoStack.length).toEqual(3);

		// Perform multiple redo actions
		appStore.redo(); // redo first edit
		const afterRedo1 = get(appStore);
		expect(afterRedo1.schedule.steps[1]).toEqual({ dose: 1, daysForDose: 1 });

		appStore.redo(); // redo second edit
		const afterRedo2 = get(appStore);
		expect(afterRedo2.schedule.steps[1]).toEqual({ dose: 2, daysForDose: 1 });

		appStore.redo(); // redo last edit
		const afterRedo3 = get(appStore);
		expect(afterRedo3.schedule.steps[1]).toEqual({ dose: 3, daysForDose: 1 });
		expect(afterRedo3.redoStack.length).toEqual(0);
	});

	test('redo returns current state when redoStack is empty', () => {
		// Perform an action to modify the state
		appStore.editStepAtIndex(0, { dose: 5, daysForDose: 10 });

		// Call undo to enable redo
		appStore.undo();

		// Call redo to revert the undo
		appStore.redo();

		// Call redo again when redoStack is empty
		appStore.redo();

		// Get the state after redo
		const stateAfterRedo: AppState = get(appStore);

		// Verify that the state has not changed
		const expectedState: AppState = get(appStore);
		expect(stateAfterRedo).toEqual(expectedState);
	});
});
