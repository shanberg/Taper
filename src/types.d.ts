type Segment = {
	dose: number;
	daysForDose: number;
};

type SegmentWithStartEndDate = {
	segment: Segment;
	segmentStartDate: ScheduleDate;
	segmentEndDate: ScheduleDate;
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

type UnitType = "solid" | "liquid" | "inhalation" | "injection" & {
	__brand: "UnitType"
}

type Unit = "mg" | "ml" & {
	__brand: "Unit"
}

type Medication = {
	name: string;
	unitSizes: number[];
	unitType: UnitType;
	unit: "mg" | "ml";
};