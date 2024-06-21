type Segment = {
	dose: number;
	daysForDose: number;
};

type Schedule = {
	segments: Segment[];
	startDate: ScheduleDate;
	templateKey: string;
	languageKey: string;
};

type SerializedSchedule = string & {
	__brand: 'SerializedSchedule';
};

type AppState = {
	schedule: Schedule;
	undoStack: SerializedSchedule[];
	redoStack: SerializedSchedule[];
	startDateInputValue: InputStringDate;
};

type Language = {
	labelEn: string;
	lang: string;
	verified: boolean;
	dir: 'ltr' | 'rtl';
};

type Template = Segment;

type Message = {
	startDate?: string | null;
	endDate?: string | null;
	content: string;
};

type ScheduleDate = Date & {
	__brand: 'ScheduleDate';
};

type InputStringDate = string & {
	__brand: 'InputStringDate';
};

type LocaleDate = string & {
	__brand: 'LocaleDate';
};
