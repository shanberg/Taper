import { writable } from 'svelte/store';
import { createInitialSchedule, isSegmentPlaceholder, yyyymmdd } from './utils';
import { TEMPLATES, PLACEHOLDER_SEGMENT } from './consts';

function createAppState(): AppState {
	const initialSchedule = createInitialSchedule();

	const { subscribe, set, update } = writable({
		schedule: initialSchedule,
		undoStack: [] as Schedule[],
		redoStack: [] as Schedule[],
		startDateInputValue: yyyymmdd(initialSchedule.startDate)
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
		changeStartDate: (newDate: string): void =>
			update((state) => {
				_saveScheduleForUndo();
				if (newDate === '') {
					// Assume we're skipping forward
					const increment = 1;
					const incrementedDate = new Date(
						state.schedule.startDate.getTime() + increment * 24 * 60 * 60 * 1000
					);
					state.schedule.startDate = incrementedDate;
					state.startDateInputValue = yyyymmdd(incrementedDate);
				} else if (!isNaN(new Date(newDate).getTime())) {
					const date = new Date(newDate);
					date.setHours(24, 0, 0, 0);
					state.schedule.startDate = date;
					state.startDateInputValue = newDate;
				} else {
					console.error('Invalid date input');
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
				state.schedule = {
					segments: [...TEMPLATES[newTemplateKey], { ...PLACEHOLDER_SEGMENT }],
					startDate: new Date()
				};
				state.startDateInputValue = yyyymmdd(state.schedule.startDate);

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
						state.schedule = poppedSchedule;
						state.schedule.startDate = new Date(state.schedule.startDate);
						state.startDateInputValue = yyyymmdd(state.schedule.startDate);
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
						state.schedule = poppedSchedule;
						state.schedule.startDate = new Date(state.schedule.startDate);
						state.startDateInputValue = yyyymmdd(state.schedule.startDate);
					}
				}
				return state;
			})
	};
}

export const appState = createAppState();
