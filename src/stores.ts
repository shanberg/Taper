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

export const INITIAL_STORE_STATE: AppState = {
	schedule: initialSchedule,
	undoStack: [],
	redoStack: [],
	startDateInputValue: new TaperDate(initialSchedule.startDate).toYYYYMMDD()
};

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

function saveScheduleForUndo(state: AppState): AppState {
	const serializedSchedule = serializeSchedule(state.schedule);
	const newUndoStack = [...state.undoStack, serializedSchedule].slice(-MAX_STACK_SIZE);
	return { ...state, undoStack: newUndoStack, redoStack: [] };
}

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

function stateAfterChangeLanguageKey(state: AppState, newLanguageKey: string): AppState {
	const newState = saveScheduleForUndo(state);
	return {
		...newState,
		schedule: { ...newState.schedule, languageKey: newLanguageKey }
	};
}

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

function stateAfterDeleteSegment(state: AppState, index: number): AppState {
	const newState = saveScheduleForUndo(state);
	const newSegments = [...newState.schedule.segments];
	newSegments.splice(index, 1);
	return { ...newState, schedule: { ...newState.schedule, segments: newSegments } };
}

function stateAfterUndo(state: AppState): AppState {
	if (state.undoStack.length === 0) return state;
	const undoTarget = state.undoStack[state.undoStack.length - 1];
	const newUndoStack = state.undoStack.slice(0, -1);
	const newRedoStack = [...state.redoStack, serializeSchedule(state.schedule)];
	const deserializedSchedule = deserializeSchedule(undoTarget);
	return { ...state, schedule: deserializedSchedule, undoStack: newUndoStack, redoStack: newRedoStack };
}

function stateAfterRedo(state: AppState): AppState {
	if (state.redoStack.length === 0) return state;
	const redoTarget = state.redoStack[state.redoStack.length - 1];
	const newRedoStack = state.redoStack.slice(0, -1);
	const newUndoStack = [...state.undoStack, serializeSchedule(state.schedule)];
	const deserializedSchedule = deserializeSchedule(redoTarget);
	return { ...state, schedule: deserializedSchedule, undoStack: newUndoStack, redoStack: newRedoStack };
}

export function createAppStore(): AppStore {
	const { subscribe, set, update } = writable<AppState>(INITIAL_STORE_STATE);

	return {
		subscribe,
		set,
		update,
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

export const appStore = createAppStore();
