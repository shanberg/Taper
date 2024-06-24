type Step = {
	dose: number;
	dose2?: number;
	duration: number;
};

type DoseDate = Date & {
	__brand: "DoseDate"
}

type DayWithDose = {
	date: ScheduleDate;
	dose: number;
	period?: string;
};

type StepWithStartEndDate = {
	step: Step;
	stepStartDate: ScheduleDate;
	stepEndDate: ScheduleDate;
};

type DisplayMode = "calendar" | "doses" | "steps"

type OutputPeriodSize = "half-day" | "day" | "week"

type StepType = "Twice Daily" | "Daily" | "Twice Weekly" | "Weekly"

type Schedule = {
	steps: Step[];
	startDate: ScheduleDate;
	stepType: StepType;
	templateKey: string;
	languageKey: string;
	displayMode: DisplayMode;
	outputPeriodSize: OutputPeriodSize;
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

type Template = Step;

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