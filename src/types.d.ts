type Segment = {
	dose: number;
	daysForDose: number;
};

type Schedule = {
	segments: Segment[];
	startDate: ScheduleDate;
	templateKey: string;
};

type AppState = {
	schedule: Schedule;
	undoStack: Schedule[];
	redoStack: Schedule[];
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

type InputStringDate = string & {
	__brand: "InputStringDate"
}

type ScheduleDate = Date & {
	__brand: "ScheduleDate"
}

type LocaleDate = string & {
	__brand: "LocaleDate"
}
