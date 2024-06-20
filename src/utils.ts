import { DEFAULT_TEMPLATE_KEY, DEFAULT_LANGUAGE_KEY, TEMPLATES, LANGUAGES } from './consts';
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

	return ""
};

const PLACEHOLDER_SEGMENT: Segment = { dose: 0, daysForDose: 0 };

export function createInitialSchedule(): Schedule {
	return {
		segments: [...TEMPLATES.Default, PLACEHOLDER_SEGMENT],
		startDate: new TaperDate().toScheduleDate(),
		templateKey: DEFAULT_TEMPLATE_KEY,
		languageKey: DEFAULT_LANGUAGE_KEY
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

export const serializeSchedule = (schedule: Schedule): SerializedSchedule => {
	return JSON.stringify(schedule, (key, value) => {
		if (key === 'startDate' || key === 'endDate' || key === 'startDateInputValue') {
			return { __brand: 'Date', value: new TaperDate(value).toYYYYMMDD() };
		}
		return value;
	}) as SerializedSchedule;
};

export const deserializeSchedule = (serializedSchedule: SerializedSchedule): Schedule => {
	return JSON.parse(serializedSchedule, (key, value) => {
		if (value && value.__brand === 'Date') {
			return new TaperDate(value.value).toScheduleDate();
		}
		return value;
	}) as Schedule;
};

export function isSegmentAfterPlaceholder(segment: Segment, segments: Segment[]) {
	if (!segment) return false;
	const thisSegmentIndex: number = segments.findIndex((s) => s === segment);

	if (thisSegmentIndex === -1) {
		return false;
	}

	const prevSegment = segments[segments.indexOf(segment) - 1];
	if (!prevSegment) return false;
	return isSegmentPlaceholder(prevSegment);
}

export function segmentIsOrAfterPlaceholder(segment: Segment, segments: Segment[]) {
	if (!segment) return false;

	if (isSegmentPlaceholder(segment)) {
		return true;
	}
	if (isSegmentAfterPlaceholder(segment, segments)) {
		return true;
	}
	return false;
}

export function getLanguageFromKey(languageKey: string): Language {
	return LANGUAGES.find(l => (l.lang === languageKey)) || LANGUAGES[0]
}