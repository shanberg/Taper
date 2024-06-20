import { DEFAULT_TEMPLATE_KEY, TEMPLATES } from './consts';
import { TaperDate } from './TaperDate';

const isDateThisYear = (date: ScheduleDate): boolean => {
	return date.getFullYear() === new Date().getFullYear();
};

/** Higher-order function to create a cached formatter */
function createCachedFormatter() {
	const dateTimeFormatCache = new Map();

	return function (date: ScheduleDate, lang: string = 'en-US'): LocaleDate {
		const yearFormat = isDateThisYear(date) ? undefined : 'numeric';
		const cacheKey = `${lang}-${yearFormat}`;

		// Check if the formatter is already in the cache
		if (!dateTimeFormatCache.has(cacheKey)) {
			// Create a new formatter and store it in the cache
			const formatter = new Intl.DateTimeFormat(lang, {
				month: 'short',
				day: 'numeric',
				year: yearFormat
			});
			dateTimeFormatCache.set(cacheKey, formatter);
		}

		// Use the cached formatter
		const formatter = dateTimeFormatCache.get(cacheKey);
		return formatter.format(date) as LocaleDate;
	};
}

// Create a cached version of formatDate
export const cachedFormatDate = createCachedFormatter();

/** Returns true if either dose or daysForDose are <= 0 */
export const isSegmentInvalid = (segment: Segment): boolean => {
	return segment.dose <= 0 || segment.daysForDose <= 0;
};

/** Returns true if dose and daysForDose are both 0 */
export const isSegmentPlaceholder = (segment: Segment): boolean => {
	return segment.dose === 0 && segment.daysForDose === 0;
};

/** Format date in YYYY-MM-DD format
 * Returns empty string if date is invalid
 */
export function yyyymmdd(date: Date | ScheduleDate): InputStringDate {
	// fail if no date provided
	if (!date) return '' as InputStringDate;

	const d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	// fail if date is invalid
	if (Number.isNaN(+month) || Number.isNaN(+day) || Number.isNaN(+year)) {
		return '' as InputStringDate;
	}

	return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-') as InputStringDate;
}

type FormatSegmentTextParams = {
	segment: Segment;
	segmentStartDate: ScheduleDate;
	segmentEndDate: ScheduleDate;
	index: number;
	selectedLanguage: Language;
};

/** Format segment content based on selected language */
export const formatSegmentText = ({
	segment,
	segmentStartDate,
	segmentEndDate,
	index,
	selectedLanguage
}: FormatSegmentTextParams): string => {
	const { lang, dir } = selectedLanguage;

	const dates = {
		start: cachedFormatDate(segmentStartDate, lang),
		end: cachedFormatDate(segmentEndDate, lang)
	};
	const formattedDateRange =
		dir === 'ltr' ? `${dates.start} - ${dates.end}` : `${dates.end} - ${dates.start}`;

	if (selectedLanguage.labelEn === 'English') {
		// English
		return `${index === 0 ? 'Take' : `Then take`} ${segment.dose}mg daily for ${segment.daysForDose} ${segment.daysForDose === 1 ? 'day' : 'days'} (${formattedDateRange})`;
	} else if (selectedLanguage.labelEn === 'Spanish') {
		// Spanish
		return `${index === 0 ? 'Tomar' : `Después tome`} ${segment.dose}mg cada día durante ${segment.daysForDose} ${segment.daysForDose === 1 ? 'día' : 'días'} (${formattedDateRange})`;
	} else if (selectedLanguage.labelEn === 'Haitian Creole') {
		// Haitian Creole
		return `${index === 0 ? 'Pran' : `Apre sa pran`} ${segment.dose}mg chak jou pou ${segment.daysForDose} ${segment.daysForDose === 1 ? 'jou' : 'jou'} (${formattedDateRange})`;
	} else if (selectedLanguage.labelEn === 'Mandarin') {
		// Mandarin
		return `${index === 0 ? '服用' : `然后服用`} ${segment.dose}毫克，每天服用${segment.daysForDose} ${segment.daysForDose === 1 ? '天' : '天'} (${formattedDateRange})`;
	} else if (selectedLanguage.labelEn === 'Swahili') {
		// Swahili
		return `${index === 0 ? 'Kutoka' : `Sasa kutoka`} ${segment.dose}mg kwa saa ${segment.daysForDose} ${segment.daysForDose === 1 ? 'siku' : 'siku'} (${formattedDateRange})`;
	} else if (selectedLanguage.labelEn === 'Arabic') {
		// Arabic
		return `${index === 0 ? 'احتياج' : `في ذلك الحين تحتاج`} ${segment.dose}mg كل يوم ${segment.daysForDose} ${segment.daysForDose === 1 ? 'يوم' : 'يوم'} (${formattedDateRange})`;
	}

	return '';
};

const PLACEHOLDER_SEGMENT: Segment = { dose: 0, daysForDose: 0 };

export function createInitialSchedule(): Schedule {
	return {
		segments: [...TEMPLATES.Default, PLACEHOLDER_SEGMENT],
		startDate: new TaperDate().toScheduleDate(),
		templateKey: DEFAULT_TEMPLATE_KEY
	};
}

export const sumDose = (schedule: Schedule): number => {
	return schedule.segments.reduce((sum, segment) => sum + segment.dose * segment.daysForDose, 0);
};

export const sumDays = (schedule: Schedule): number => {
	return (
		schedule.segments.reduce((sum, segment) => sum + segment.daysForDose, 0) +
		schedule.segments.length -
		2
	);
};

export const calculateEndDate = (schedule: Schedule): ScheduleDate => {
	return new TaperDate(new Date(schedule.startDate.getTime() + sumDays(schedule) * 24 * 60 * 60 * 1000)).toScheduleDate();
};


export const serializeSchedule = (schedule: Schedule): SerializedSchedule => {
	return JSON.stringify(schedule, (key, value) => {
		if (key === "startDate" || key === "endDate" || key === "startDateInputValue") {
			return { __brand: 'Date', value: new TaperDate(value).toYYYYMMDD() };
		}
		return value;
	}) as SerializedSchedule
};

export const deserializeSchedule = (serializedSchedule: SerializedSchedule): Schedule => {
	return JSON.parse(serializedSchedule, (key, value) => {
		if (value && value.__brand === 'Date') {
			return new TaperDate(value.value).toScheduleDate()
		}
		return value;
	}) as Schedule
};