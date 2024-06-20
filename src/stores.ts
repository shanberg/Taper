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

export function createAppStore(): AppStore {
	const { subscribe, set, update } = writable<AppState>(INITIAL_STORE_STATE);

	const _saveScheduleForUndo = (state: AppState): AppState => {
		const serializedSchedule = serializeSchedule(state.schedule);
		const newUndoStack = [...state.undoStack, serializedSchedule].slice(-MAX_STACK_SIZE);
		return { ...state, undoStack: newUndoStack, redoStack: [] };
	};

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
			update((state) => {
				const prevSegments = [...state.schedule.segments];
				const newState = _saveScheduleForUndo(state);
				let newSegments = [...prevSegments];

				updatedSegment.dose = updatedSegment.dose || 0
				updatedSegment.daysForDose = updatedSegment.daysForDose || 0

				newSegments[index] = updatedSegment;

				// console.log(newSegments, newSegments.some(s => isSegmentPlaceholder(s)))

				if (!newSegments.some(s => isSegmentPlaceholder(s))) {
					newSegments = [...newSegments, { ...PLACEHOLDER_SEGMENT }];
				}

				// console.log(newSegments, newSegments.some(s => isSegmentPlaceholder(s)))

				return { ...newState, schedule: { ...newState.schedule, segments: newSegments } };
			}),
		changeStartDate: (newDate: ScheduleDate | InputStringDate): void =>
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				const newTaperDate =
					newDate === '' ? new TaperDate().incrementByOneDay() : new TaperDate(newDate);
				return {
					...newState,
					schedule: { ...newState.schedule, startDate: newTaperDate.toScheduleDate() },
					startDateInputValue: newTaperDate.toYYYYMMDD()
				};
			}),
		changeLanguageKey: (newLanguageKey: string): void => {
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				return {
					...newState,
					schedule: { ...newState.schedule, languageKey: newLanguageKey }
				};
			});
		},
		insertPlaceholderSegmentBeforeIndex: (index: number): void =>
			update((state) => {
				const newState = _saveScheduleForUndo(state);
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
			}),
		switchTemplate: (newTemplateKey: string): void =>
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				return {
					...newState,
					schedule: {
						...newState.schedule,
						segments: [...TEMPLATES[newTemplateKey], { ...PLACEHOLDER_SEGMENT }],
						templateKey: newTemplateKey
					}
				};
			}),
		deleteSegmentAtIndex: (index: number): void =>
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				const newSegments = [...newState.schedule.segments];
				newSegments.splice(index, 1);
				return { ...newState, schedule: { ...newState.schedule, segments: newSegments } };
			}),
		undo: (): void =>
			update((state) => {
				if (state.undoStack.length > 0) {
					const undoTarget = state.undoStack.pop()!;
					const newRedoStack = [...state.redoStack, serializeSchedule(state.schedule)];
					const deserializedSchedule = deserializeSchedule(undoTarget);
					return { ...state, schedule: deserializedSchedule, redoStack: newRedoStack };
				}
				return state;
			}),
		redo: (): void =>
			update((state) => {
				if (state.redoStack.length > 0) {
					const redoTarget = state.redoStack.pop()!;
					const newUndoStack = [...state.undoStack, serializeSchedule(state.schedule)];
					const deserializedSchedule = deserializeSchedule(redoTarget);

					return { ...state, schedule: deserializedSchedule, undoStack: newUndoStack };
				}
				return state;
			})
	};
}

export const appStore = createAppStore();
