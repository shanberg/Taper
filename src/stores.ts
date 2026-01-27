/**
 * @fileoverview Application store: schedule, undo/redo stacks, and start-date input.
 * Exposes a Svelte writable store extended with actions for editing the taper schedule.
 */
import { writable, type Writable } from 'svelte/store';
import {
	createInitialSchedule,
	isSegmentPlaceholder,
	serializeSchedule,
	deserializeSchedule
} from './utils';
import { TEMPLATES, PLACEHOLDER_SEGMENT } from './consts';
import { TaperDate } from './TaperDate';

const initialSchedule = createInitialSchedule();
const MAX_STACK_SIZE = 50;

/**
 * Initial app state used when the store is created or reset.
 * @description Schedule from default template, empty undo/redo stacks, start date as YYYY-MM-DD.
 */
export const INITIAL_STORE_STATE: AppState = {
	schedule: initialSchedule,
	undoStack: [],
	redoStack: [],
	startDateInputValue: new TaperDate(initialSchedule.startDate).toYYYYMMDD()
};

/**
 * Writable store of AppState plus methods to edit segments, change start date, template, language, undo/redo, and reset.
 * @description Extends Svelte Writable with editSegmentAtIndex, changeStartDate, undo, redo, reset, etc.
 */
export type AppStore = Writable<AppState> & {
	editSegmentAtIndex: (index: number, updatedSegment: Segment) => void;
	changeStartDate: (newDate: ScheduleDate | InputStringDate) => void;
	changeLanguageKey: (newLanguageKey: string) => void;
	insertPlaceholderSegmentBeforeIndex: (index: number) => void;
	switchTemplate: (newTemplateKey: string) => void;
	deleteSegmentAtIndex: (index: number) => void;
	reset: () => void;
	undo: () => void;
	redo: () => void;
};

/**
 * Saves the current schedule onto the undo stack and clears redo; caps undo stack at MAX_STACK_SIZE.
 * @param state - Current app state
 * @returns New state with updated undo stack and cleared redo stack
 */
function saveScheduleForUndo(state: AppState): AppState {
	const serializedSchedule = serializeSchedule(state.schedule);
	const newUndoStack = [...state.undoStack, serializedSchedule].slice(-MAX_STACK_SIZE);
	return { ...state, undoStack: newUndoStack, redoStack: [] };
}

/**
 * Returns new state after updating the segment at index; appends a placeholder if none exists.
 * @param state - Current app state
 * @param index - Index of the segment to update
 * @param updatedSegment - New segment data
 * @returns New state with updated segment
 */
function stateAfterEditSegment(
	state: AppState,
	index: number,
	updatedSegment: Segment
): AppState {
	const newState = saveScheduleForUndo(state);
	const prevSegments = [...state.schedule.segments];
	let newSegments = [...prevSegments];

	updatedSegment.dose = updatedSegment.dose || 0;
	updatedSegment.daysForDose = updatedSegment.daysForDose || 0;

	newSegments[index] = updatedSegment;

	if (!newSegments.some((s) => isSegmentPlaceholder(s))) {
		newSegments = [...newSegments, { ...PLACEHOLDER_SEGMENT }];
	}

	return { ...newState, schedule: { ...newState.schedule, segments: newSegments } };
}

/**
 * Returns new state after setting the schedule start date and startDateInputValue.
 * @param state - Current app state
 * @param newDate - New start date (ScheduleDate or YYYY-MM-DD string)
 * @returns New state with updated start date
 */
function stateAfterChangeStartDate(
	state: AppState,
	newDate: ScheduleDate | InputStringDate
): AppState {
	const newState = saveScheduleForUndo(state);
	const newTaperDate =
		newDate === '' ? new TaperDate().incrementByOneDay() : new TaperDate(newDate);
	return {
		...newState,
		schedule: { ...newState.schedule, startDate: newTaperDate.toScheduleDate() },
		startDateInputValue: newTaperDate.toYYYYMMDD()
	};
}

/**
 * Returns new state after changing the schedule language key.
 * @param state - Current app state
 * @param newLanguageKey - New language key
 * @returns New state with updated language key
 */
function stateAfterChangeLanguageKey(state: AppState, newLanguageKey: string): AppState {
	const newState = saveScheduleForUndo(state);
	return {
		...newState,
		schedule: { ...newState.schedule, languageKey: newLanguageKey }
	};
}

/**
 * Returns new state after inserting a placeholder segment before index; may replace an inner placeholder.
 * @param state - Current app state
 * @param index - Index before which to insert
 * @returns New state with placeholder inserted
 */
function stateAfterInsertPlaceholder(state: AppState, index: number): AppState {
	const newState = saveScheduleForUndo(state);
	const allSegments = newState.schedule.segments;
	const allButLastSegment = allSegments.slice(0, -1);
	const scheduleContainsInnerPlaceholders = allButLastSegment.some((s) =>
		isSegmentPlaceholder(s)
	);

	if (!scheduleContainsInnerPlaceholders) {
		const newSegments = [...allSegments];
		newSegments.splice(index, 0, { ...PLACEHOLDER_SEGMENT });
		return { ...newState, schedule: { ...newState.schedule, segments: newSegments } };
	}

	const currentInnerPlaceholderIndex = allButLastSegment.findIndex(isSegmentPlaceholder);
	const isIndexBeforeCurrentInnerPlaceholder = index < currentInnerPlaceholderIndex;

	const newSegments = allSegments.filter((segment) => !isSegmentPlaceholder(segment));
	if (!newSegments.some(isSegmentPlaceholder)) {
		newSegments.push({ ...PLACEHOLDER_SEGMENT });
	}

	if (isIndexBeforeCurrentInnerPlaceholder) {
		newSegments.splice(Math.max(0, index), 0, { ...PLACEHOLDER_SEGMENT });
	} else {
		newSegments.splice(index - 1, 0, { ...PLACEHOLDER_SEGMENT });
	}
	return { ...newState, schedule: { ...newState.schedule, segments: newSegments } };
}

/**
 * Returns new state after switching to the given template (replaces segments, keeps one placeholder).
 * @param state - Current app state
 * @param newTemplateKey - Template key to switch to
 * @returns New state with template applied
 */
function stateAfterSwitchTemplate(state: AppState, newTemplateKey: string): AppState {
	const newState = saveScheduleForUndo(state);
	return {
		...newState,
		schedule: {
			...newState.schedule,
			segments: [...TEMPLATES[newTemplateKey], { ...PLACEHOLDER_SEGMENT }],
			templateKey: newTemplateKey
		}
	};
}

/**
 * Returns new state after removing the segment at index.
 * @param state - Current app state
 * @param index - Index of segment to remove
 * @returns New state with segment removed
 */
function stateAfterDeleteSegment(state: AppState, index: number): AppState {
	const newState = saveScheduleForUndo(state);
	const newSegments = [...newState.schedule.segments];
	newSegments.splice(index, 1);
	return { ...newState, schedule: { ...newState.schedule, segments: newSegments } };
}

/**
 * Returns new state after popping from one stack and applying it, pushing current schedule onto the other.
 * Shared logic for undo (pop undo, push to redo) and redo (pop redo, push to undo).
 * @param state - Current app state
 * @param fromStackKey - Key of stack to pop from ('undoStack' or 'redoStack')
 * @param toStackKey - Key of stack to push current schedule onto
 * @returns New state with applied schedule and updated stacks, or unchanged if source stack empty
 */
function stateAfterUndoOrRedo(
	state: AppState,
	fromStackKey: 'undoStack' | 'redoStack',
	toStackKey: 'redoStack' | 'undoStack'
): AppState {
	const fromStack = state[fromStackKey];
	const toStack = state[toStackKey];
	if (fromStack.length === 0) return state;
	const target = fromStack[fromStack.length - 1];
	const newFrom = fromStack.slice(0, -1);
	const newTo = [...toStack, serializeSchedule(state.schedule)];
	const deserialized = deserializeSchedule(target);
	return {
		...state,
		schedule: deserialized,
		[fromStackKey]: newFrom,
		[toStackKey]: newTo
	};
}

/**
 * Returns new state after popping the last undo entry and applying it; no-op if undo stack is empty.
 * @param state - Current app state
 * @returns New state after undo or unchanged if stack empty
 */
function stateAfterUndo(state: AppState): AppState {
	return stateAfterUndoOrRedo(state, 'undoStack', 'redoStack');
}

/**
 * Returns new state after popping the last redo entry and applying it; no-op if redo stack is empty.
 * @param state - Current app state
 * @returns New state after redo or unchanged if stack empty
 */
function stateAfterRedo(state: AppState): AppState {
	return stateAfterUndoOrRedo(state, 'redoStack', 'undoStack');
}

type StoreUpdater = (fn: (state: AppState) => AppState) => void;

/**
 * Builds the action methods that dispatch updates. Used by createAppStore to keep its body small.
 * @param update - Store updater function (set state from a callback)
 * @returns Object with editSegmentAtIndex, changeStartDate, undo, redo, reset, etc.
 */
function createStoreActions(update: StoreUpdater): Omit<
	AppStore,
	'subscribe' | 'set' | 'update'
> {
	return {
		reset: (): void =>
			update((state) => ({
				...state,
				schedule: INITIAL_STORE_STATE.schedule,
				undoStack: [],
				redoStack: [],
				startDateInputValue: INITIAL_STORE_STATE.startDateInputValue
			})),
		editSegmentAtIndex: (index: number, updatedSegment: Segment): void =>
			update((state) => stateAfterEditSegment(state, index, updatedSegment)),
		changeStartDate: (newDate: ScheduleDate | InputStringDate): void =>
			update((state) => stateAfterChangeStartDate(state, newDate)),
		changeLanguageKey: (newLanguageKey: string): void =>
			update((state) => stateAfterChangeLanguageKey(state, newLanguageKey)),
		insertPlaceholderSegmentBeforeIndex: (index: number): void =>
			update((state) => stateAfterInsertPlaceholder(state, index)),
		switchTemplate: (newTemplateKey: string): void =>
			update((state) => stateAfterSwitchTemplate(state, newTemplateKey)),
		deleteSegmentAtIndex: (index: number): void =>
			update((state) => stateAfterDeleteSegment(state, index)),
		undo: (): void => update(stateAfterUndo),
		redo: (): void => update(stateAfterRedo)
	};
}

/**
 * Creates and returns a new app store with subscribe/set/update and all edit/undo/redo/reset methods.
 * @returns A writable AppStore with actions for schedule edits, undo, redo, and reset
 */
export function createAppStore(): AppStore {
	const { subscribe, set, update } = writable<AppState>(INITIAL_STORE_STATE);
	return { subscribe, set, update, ...createStoreActions(update) };
}

/**
 * Singleton app store used by the application.
 * @description Writable AppStore with schedule, undo/redo, and edit actions.
 */
export const appStore = createAppStore();
