import { writable, type Writable } from 'svelte/store';
import {
	createInitialSchedule,
	isStepPlaceholder,
	serializeSchedule,
	deserializeSchedule
} from './utils';
import { TEMPLATES, PLACEHOLDER_STEP, PLACEHOLDER_TWICE_STEP } from './consts';
import { TaperDate } from './TaperDate';

const initialSchedule = createInitialSchedule();
const MAX_STACK_SIZE = 50;

export const INITIAL_STORE_STATE: AppState = {
	schedule: initialSchedule,
	undoStack: [],
	redoStack: [],
	startDateInputValue: new TaperDate(initialSchedule.startDate).toYYYYMMDD()
};

const convertScheduleToTwiceType = (schedule: Schedule) => {
	return schedule.steps.map((s: Step) => ({ ...s, dose2: s.dose }));
}

const convertScheduleToSingleType = (schedule: Schedule) => {
	return schedule.steps.map((s: Step) => ({ ...s, dose2: undefined }));
}

const getIsStepTypeTwice = (stepType: StepType): boolean => {
	return stepType.startsWith("Twice")
}

const placeholderForStepType = (stepType: StepType) => {
	if (getIsStepTypeTwice(stepType)) {
		return { ...PLACEHOLDER_TWICE_STEP }
	} else {
		return { ...PLACEHOLDER_STEP }
	}
}


export type AppStore = Writable<AppState> & {
	editStepAtIndex: (index: number, updatedStep: Step) => void;
	changeOutputPeriodSize: (newOutputPeriodSize: OutputPeriodSize) => void;
	changeStepType: (stepType: StepType) => void;
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
				updatedStep.duration = updatedStep.duration || 0;

				newSteps[index] = updatedStep;

				if (!newSteps.some((s) => isStepPlaceholder(s))) {
					newSteps = [...newSteps, placeholderForStepType(state.schedule.stepType)];
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
		changeOutputPeriodSize: (newOutputPeriodSize: OutputPeriodSize): void => {
			update((state) => {
				const newState = _saveScheduleForUndo(state);
				return {
					...newState,
					schedule: { ...newState.schedule, outputPeriodSize: newOutputPeriodSize }
				};
			});
		},
		changeStepType: (stepType: StepType): void => {
			update((state) => {
				const newState = _saveScheduleForUndo(state);

				const newStepTypeIsTwice = stepType.startsWith("Twice");
				let newSteps;

				if (newStepTypeIsTwice) {
					newSteps = convertScheduleToTwiceType(state.schedule)
				} else {
					newSteps = convertScheduleToSingleType(state.schedule)
				}

				return {
					...newState,
					schedule: { ...newState.schedule, steps: newSteps, stepType }
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
					newSteps.splice(index, 0, placeholderForStepType(newState.schedule.stepType));
					return { ...newState, schedule: { ...newState.schedule, steps: newSteps } };
				}

				const currentInnerPlaceholderIndex = allButLastStep.findIndex(isStepPlaceholder);
				const isIndexBeforeCurrentInnerPlaceholder = index < currentInnerPlaceholderIndex;

				const newSteps = allSteps.filter((step) => !isStepPlaceholder(step));
				if (!newSteps.some(isStepPlaceholder)) {
					newSteps.push(placeholderForStepType(newState.schedule.stepType));
				}

				if (isIndexBeforeCurrentInnerPlaceholder) {
					newSteps.splice(Math.max(0, index), 0, placeholderForStepType(newState.schedule.stepType));
				} else {
					newSteps.splice(index - 1, 0, placeholderForStepType(newState.schedule.stepType));
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
						steps: [...TEMPLATES[newTemplateKey], placeholderForStepType(newState.schedule.stepType)],
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
