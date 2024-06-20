import { writable } from 'svelte/store';
import { createInitialSchedule, isSegmentPlaceholder } from './utils';
import { TEMPLATES, PLACEHOLDER_SEGMENT } from './consts';
import { TaperDate } from './TaperDate';

function createAppState(): AppState {
    const initialSchedule = createInitialSchedule();

    const { subscribe, set, update } = writable({
        schedule: initialSchedule,
        undoStack: [] as Schedule[],
        redoStack: [] as Schedule[],
        startDateInputValue: new TaperDate(initialSchedule.startDate).toYYYYMMDD()
    });

    const _removePlaceholderSegments = (): void =>
        update((state) => {
            state.schedule.segments = state.schedule.segments.filter(
                (segment: Segment) => !isSegmentPlaceholder(segment)
            );
            return state;
        });


    /**
     * Pushes the current schedule to the undo stack and clears the redo stack
     */
    const _saveScheduleForUndo = (): void =>
        update((state) => {
            state.undoStack.push(JSON.parse(JSON.stringify(state.schedule)));
            state.redoStack = [];
            return state;
        });

    return {
        subscribe,
        set,
        /**
         * Handles segment changes, pushing the current schedule to the undo stack and clears the redo stack
         */
        editSegmentAtIndex: (index: number, newSegment: Segment): void =>
            update((state) => {
                _saveScheduleForUndo();

                // Update the segment
                state.schedule.segments[index] = newSegment;

                // Remove empty segments
                _removePlaceholderSegments();

                // Add a placeholder back at the end
                state.schedule.segments.push({ ...PLACEHOLDER_SEGMENT });

                return state;
            }),

        /**
         * Handles changing the start date, pushing the current schedule to the undo stack and clears the redo stack
         */
        changeStartDate: (newDate: ScheduleDate | InputStringDate): void =>
            update((state) => {
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
            update((state) => {
                _saveScheduleForUndo();

                const currentPlaceholderIndex = state.schedule.segments.findIndex((segment: Segment) =>
                    isSegmentPlaceholder(segment)
                );
                if (index < currentPlaceholderIndex) {
                    index = index + 1;
                }

                // Remove existing placeholder
                _removePlaceholderSegments();

                // Add placeholder before index
                state.schedule.segments.splice(index, 0, { ...PLACEHOLDER_SEGMENT });

                return state;
            }),
        /**
         * Handles changing the template, pushing the current schedule to the undo stack and clears the redo stack
         */
        switchTemplate: (newTemplateKey: string): void =>
            update((state) => {
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
            update((state) => {
                if (state.undoStack.length > 0) {
                    state.redoStack.push(JSON.parse(JSON.stringify(state)));
                    const poppedSchedule = state.undoStack.pop();
                    if (poppedSchedule) {
                        state.schedule = {
                            ...state.schedule,
                            ...poppedSchedule
                        }
                    }
                }
                return state;
            }),
        redo: (): void =>
            update((state) => {
                if (state.redoStack.length > 0) {
                    state.undoStack.push(JSON.parse(JSON.stringify(state.schedule)));
                    const poppedSchedule = state.redoStack.pop();
                    if (poppedSchedule) {
                        state.schedule = {
                            ...state.schedule,
                            ...poppedSchedule
                        }
                    }
                }
                return state;
            })
    };
}

export const appState = createAppState();
