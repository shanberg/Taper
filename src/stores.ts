import { writable, type Writable } from 'svelte/store';
import {
	createInitialSchedule,
	isStepPlaceholder,
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
	editStepAtIndex: (index: number, updatedStep: Step) => void;
	changeStartDate: (newDate: ScheduleDate | InputStringDate) => void;
	changeLanguageKey: (newLanguageKey: string) => void;
	changeDisplayMode: (newDisplayMode: DisplayMode) => void;
	insertPlaceholderStepBeforeIndex: (index: number) => void;
	switchTemplate: (newTemplateKey: string) => void;
	deleteStepAtIndex: (index: number) => void;
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
		editStepAtIndex: (index: number, updatedStep: Step): void =>
			update((state) => {
				const prevSteps = [...state.schedule.steps];
				const newState = _saveScheduleForUndo(state);
				let newSteps = [...prevSteps];

				updatedStep.dose = updatedStep.dose || 0;
				updatedStep.daysForDose = updatedStep.daysForDose || 0;

				newSteps[index] = updatedStep;

				if (!newSteps.some((s) => isStepPlaceholder(s))) {
					newSteps = [...newSteps, { ...PLACEHOLDER_SEGMENT }];
				}

				return { ...newState, schedule: { ...newState.schedule, steps: newSteps } };
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
		changeDisplayMode: (newDisplayMode: DisplayMode): void => {
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				return {
					...newState,
					schedule: { ...newState.schedule, displayMode: newDisplayMode }
				};
			});
		},
		insertPlaceholderStepBeforeIndex: (index: number): void =>
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				const allSteps = newState.schedule.steps;
				const allButLastStep = allSteps.slice(0, -1);
				const scheduleContainsInnerPlaceholders = allButLastStep.some((s) =>
					isStepPlaceholder(s)
				);

				if (!scheduleContainsInnerPlaceholders) {
					const newSteps = [...allSteps];
					newSteps.splice(index, 0, { ...PLACEHOLDER_SEGMENT });
					return { ...newState, schedule: { ...newState.schedule, steps: newSteps } };
				}

				const currentInnerPlaceholderIndex = allButLastStep.findIndex(isStepPlaceholder);
				const isIndexBeforeCurrentInnerPlaceholder = index < currentInnerPlaceholderIndex;

				const newSteps = allSteps.filter((step) => !isStepPlaceholder(step));
				if (!newSteps.some(isStepPlaceholder)) {
					newSteps.push({ ...PLACEHOLDER_SEGMENT });
				}

				if (isIndexBeforeCurrentInnerPlaceholder) {
					newSteps.splice(Math.max(0, index), 0, { ...PLACEHOLDER_SEGMENT });
				} else {
					newSteps.splice(index - 1, 0, { ...PLACEHOLDER_SEGMENT });
				}
				return { ...newState, schedule: { ...newState.schedule, steps: newSteps } };
			}),
		switchTemplate: (newTemplateKey: string): void =>
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				return {
					...newState,
					schedule: {
						...newState.schedule,
						steps: [...TEMPLATES[newTemplateKey], { ...PLACEHOLDER_SEGMENT }],
						templateKey: newTemplateKey
					}
				};
			}),
		deleteStepAtIndex: (index: number): void =>
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				const newSteps = [...newState.schedule.steps];
				newSteps.splice(index, 1);
				return { ...newState, schedule: { ...newState.schedule, steps: newSteps } };
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
