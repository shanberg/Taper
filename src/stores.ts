import { writable, type Writable } from 'svelte/store';
import { createInitialSchedule, isSegmentPlaceholder } from './utils';
import { TEMPLATES, PLACEHOLDER_SEGMENT } from './consts';
import { TaperDate } from './TaperDate';

const initialSchedule = createInitialSchedule();

export const INITIAL_STATE: AppState = {
    schedule: initialSchedule,
    undoStack: [],
    redoStack: [],
    startDateInputValue: new TaperDate(initialSchedule.startDate).toYYYYMMDD()
}

export type AppStore = Writable<AppState> & {
    editSegmentAtIndex: (index: number, updatedSegment: Segment) => void;
    changeStartDate: (newDate: ScheduleDate | InputStringDate) => void;
    insertPlaceholderSegmentBeforeIndex: (index: number) => void;
    switchTemplate: (newTemplateKey: string) => void;
    deleteSegmentAtIndex: (index: number) => void;
    reset: () => void;
    undo: () => void;
    redo: () => void;
}

export function createAppStore(): AppStore {
    const { subscribe, set, update } = writable<AppState>(INITIAL_STATE);

    /**
     * Filters out all placeholders, then adds one back to the end
     */
    const _removeNonLastPlaceholder = (): void =>
        update((state: AppState): AppState => {
            state.schedule.segments = state.schedule.segments.filter(
                (segment: Segment) => !isSegmentPlaceholder(segment)
            );
            if (!state.schedule.segments.some((s: Segment) => isSegmentPlaceholder(s))) {
                state.schedule.segments.push(PLACEHOLDER_SEGMENT);
            }
            return state;
        });

    /**
     * Pushes the current schedule to the undo stack and clears the redo stack
     */
    const _saveStateForUndo = (): void =>
        update((state: AppState): AppState => {
            state.undoStack.push(JSON.parse(JSON.stringify(state)));
            state.redoStack = [];
            return state;
        });

    return {
        update,
        subscribe,
        set,
        reset: (): void =>
            update((state: AppState): AppState => {
                state.schedule = INITIAL_STATE.schedule;
                state.undoStack = []
                state.redoStack = []
                state.startDateInputValue = INITIAL_STATE.startDateInputValue;
                return state
            }),
        /**
         * Handles segment changes, pushing the current schedule to the undo stack and clears the redo stack
         */
        editSegmentAtIndex: (index: number, updatedSegment: Segment): void =>
            update((state: AppState): AppState => {
                _saveStateForUndo();
                // Update the segment
                state.schedule.segments[index] = updatedSegment;

                return state;
            }),

        /**
         * Handles changing the start date, pushing the current schedule to the undo stack and clears the redo stack
         */
        changeStartDate: (newDate: ScheduleDate | InputStringDate): void =>
            update((state: AppState): AppState => {
                _saveStateForUndo();

                if (newDate === '') {
                    const updatedDate = new TaperDate().incrementByOneDay();
                    state.schedule.startDate = updatedDate.toScheduleDate();
                    state.startDateInputValue = updatedDate.toYYYYMMDD()
                } else {
                    const newTaperDate = new TaperDate(newDate);
                    state.schedule.startDate = newTaperDate.toScheduleDate()
                    state.startDateInputValue = newTaperDate.toYYYYMMDD()
                }

                return state;
            }),
        /**
         * Handles adding a new segment, pushing the current schedule to the undo stack and clears the redo stack
         */
        insertPlaceholderSegmentBeforeIndex: (index: number): void =>
            update((state: AppState): AppState => {
                _saveStateForUndo();

                const allSegments = state.schedule.segments;
                const allButLastSegment = allSegments.slice(0, -1);
                const scheduleContainsInnerPlaceholders = allButLastSegment.some(s => isSegmentPlaceholder(s));

                // simplest case, just insert and return
                if (!scheduleContainsInnerPlaceholders) {
                    state.schedule.segments.splice(index, 0, { ...PLACEHOLDER_SEGMENT });
                    return state;
                }

                // otherwise...

                // check if the insertion point is before the existing inner placeholder
                const currentInnerPlaceholderIndex = allButLastSegment.findIndex((segment: Segment) =>
                    isSegmentPlaceholder(segment)
                );
                const isIndexBeforeCurrentInnerPlaceholder = (index < currentInnerPlaceholderIndex)

                // if it is, remove the existing placeholder and insert the new one
                if (isIndexBeforeCurrentInnerPlaceholder) {
                    _removeNonLastPlaceholder();
                    state.schedule.segments.splice(Math.max(0, index), 0, { ...PLACEHOLDER_SEGMENT });
                    return state;
                }

                // otherwise...

                // the insertion point is after an existing placeholder,
                // so we get cute with the index before returning updated state

                _removeNonLastPlaceholder();
                // then insert at the index *before* the one specified
                state.schedule.segments.splice(index - 1, 0, { ...PLACEHOLDER_SEGMENT });
                return state;
            }),
        /**
         * Handles changing the template, pushing the current schedule to the undo stack and clears the redo stack
         */
        switchTemplate: (newTemplateKey: string): void =>
            update((state: AppState): AppState => {
                _saveStateForUndo();
                state.schedule.segments = [...TEMPLATES[newTemplateKey], { ...PLACEHOLDER_SEGMENT }]
                state.schedule.templateKey = newTemplateKey;
                return state;
            }),
        /**
         * Handles removing a segment, pushing the current schedule to the undo stack and clears the redo stack
         */
        deleteSegmentAtIndex: (index: number): void =>
            update((state) => {
                _saveStateForUndo();
                state.schedule.segments.splice(index, 1);
                return state;
            }),
        undo: (): void =>
            update((state: AppState): AppState => {
                // console.log("beforeState", state)
                if (state.undoStack.length > 0) {
                    state.redoStack.push(JSON.parse(JSON.stringify(state)));
                    const poppedState = state.undoStack.pop();
                    if (poppedState) {
                        state = poppedState
                    }
                }
                // console.log("stateAfterUndo", state)
                return state;
            }),
        redo: (): void =>
            update((state: AppState): AppState => {
                if (state.redoStack.length > 0) {
                    state.undoStack.push(JSON.parse(JSON.stringify(state.schedule)));
                    const poppedState = state.redoStack.pop();
                    if (poppedState) {
                        state = poppedState
                    }
                }
                return state;
            })
    };
}

export const appStore = createAppStore();
