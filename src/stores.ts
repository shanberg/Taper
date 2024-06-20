import { writable, type Writable } from 'svelte/store';
import { createInitialSchedule, isSegmentPlaceholder } from './utils';
import { TEMPLATES, PLACEHOLDER_SEGMENT } from './consts';
import { TaperDate } from './TaperDate';

const initialSchedule = createInitialSchedule();

export const INITIAL_STATE: AppState = {
    schedule: initialSchedule,
    undoStack: [] as Schedule[],
    redoStack: [] as Schedule[],
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
    const _saveScheduleForUndo = (): void =>
        update((state: AppState): AppState => {
            state.undoStack.push(JSON.parse(JSON.stringify(state.schedule)));
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
                _saveScheduleForUndo();
                const originalSegment = state.schedule.segments[index]

                if (isSegmentPlaceholder(originalSegment)) {

                }

                if (isSegmentPlaceholder(updatedSegment)) {

                }

                // Update the segment
                state.schedule.segments[index] = updatedSegment;

                return state;
            }),

        /**
         * Handles changing the start date, pushing the current schedule to the undo stack and clears the redo stack
         */
        changeStartDate: (newDate: ScheduleDate | InputStringDate): void =>
            update((state: AppState): AppState => {
                _saveScheduleForUndo();

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
                _saveScheduleForUndo();

                const allSegments = state.schedule.segments;
                const allButLastSegment = allSegments.slice(0, -1);

                const currentInnerPlaceholderIndex = allButLastSegment.findIndex((segment: Segment) =>
                    isSegmentPlaceholder(segment)
                );

                const isIndexAfterCurrentInnerPlaceholder = (index > currentInnerPlaceholderIndex)

                if (isIndexAfterCurrentInnerPlaceholder) {
                    // first remove the preceding placeholder
                    _removeNonLastPlaceholder();
                    // then insert at the index *before* the one specified
                    state.schedule.segments.splice(index, 0, { ...PLACEHOLDER_SEGMENT });
                } else {
                    // first remove all other placeholders
                    _removeNonLastPlaceholder();
                    // then insert one at the index specified
                    state.schedule.segments.splice(index - 1, 0, { ...PLACEHOLDER_SEGMENT });
                }

                return state;
            }),
        /**
         * Handles changing the template, pushing the current schedule to the undo stack and clears the redo stack
         */
        switchTemplate: (newTemplateKey: string): void =>
            update((state: AppState): AppState => {
                _saveScheduleForUndo();
                state.schedule.segments = [...TEMPLATES[newTemplateKey], { ...PLACEHOLDER_SEGMENT }]
                state.schedule.templateKey = newTemplateKey;
                return state;
            }),
        /**
         * Handles removing a segment, pushing the current schedule to the undo stack and clears the redo stack
         */
        deleteSegmentAtIndex: (index: number): void =>
            update((state) => {
                _saveScheduleForUndo();
                state.schedule.segments.splice(index, 1);

                return state;
            }),
        undo: (): void =>
            update((state: AppState): AppState => {
                if (state.undoStack.length > 0) {
                    state.redoStack.push(JSON.parse(JSON.stringify(state)));
                    const poppedSchedule = state.undoStack.pop();
                    if (poppedSchedule) {
                        state.schedule.segments = poppedSchedule.segments;
                        state.schedule.startDate = new TaperDate(poppedSchedule.startDate).toScheduleDate()
                        state.schedule.templateKey = poppedSchedule.templateKey;
                    }
                }
                return state;
            }),
        redo: (): void =>
            update((state: AppState): AppState => {
                if (state.redoStack.length > 0) {
                    state.undoStack.push(JSON.parse(JSON.stringify(state.schedule)));
                    const poppedSchedule = state.redoStack.pop();
                    if (poppedSchedule) {
                        state.schedule.segments = poppedSchedule.segments;
                        state.schedule.startDate = new TaperDate(poppedSchedule.startDate).toScheduleDate()
                        state.schedule.templateKey = poppedSchedule.templateKey;
                    }
                }
                return state;
            })
    };
}

export const appStore = createAppStore();
