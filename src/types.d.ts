type Segment = {
	dose: number;
	daysForDose: number;
};

type Schedule = {
	segments: Segment[];
	startDate: Date;
};

type AppState = Writeable & {
	schedule: Schedule;
	undoStack: Schedule[];
	redoStack: Schedule[];
	startDateInputValue: string;
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
