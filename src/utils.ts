import { LANGUAGES } from './consts';

const isDateThisYear = (date: Date): boolean => {
	return date.getFullYear() === new Date().getFullYear();
};

/** Higher-order function to create a cached formatter */
function createCachedFormatter() {
	const dateTimeFormatCache = new Map();

	return function (date: Date, lang: string = 'en-US') {
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
		return formatter.format(date);
	};
}

// Create a cached version of formatDate
export const cachedFormatDate = createCachedFormatter();

/** Returns true if either dose or daysForDose are <= 0 */
export const isRowInvalid = (row: Row): boolean => {
	return row.dose <= 0 || row.daysForDose <= 0;
};

/** Returns true if dose and daysForDose are both 0 */
export const isRowPlaceholder = (row: Row): boolean => {
	return row.dose === 0 && row.daysForDose === 0;
};

/** Format date in YYYY-MM-DD format
 * Returns empty string if date is invalid
 */
export function yyyymmdd(date: Date): string {
	// fail if no date provided
	if (!date) return '';

	const d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	// fail if date is invalid
	if (Number.isNaN(+month) || Number.isNaN(+day) || Number.isNaN(+year)) {
		return '';
	}

	return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

type FormatRowTextParams = {
	row: Row;
	rowStartDate: Date;
	rowEndDate: Date;
	index: number;
	selectedLanguageKey: string;
};

/** Format row content based on selected language */
export const formatRowText = ({
	row,
	rowStartDate,
	rowEndDate,
	index,
	selectedLanguageKey
}: FormatRowTextParams): string => {
	if (!LANGUAGES[selectedLanguageKey]) {
		throw new Error(`Unknown language: ${selectedLanguageKey}`);
	}

	const { lang, dir } = LANGUAGES[selectedLanguageKey];
	const dates = {
		start: cachedFormatDate(rowStartDate, lang),
		end: cachedFormatDate(rowEndDate, lang)
	};
	const formattedDateRange =
		dir === 'ltr' ? `${dates.start} - ${dates.end}` : `${dates.end} - ${dates.start}`;

	if (selectedLanguageKey === 'English') {
		// English
		return `${index === 0 ? 'Take' : `Then take`} ${row.dose}mg daily for ${row.daysForDose} ${row.daysForDose === 1 ? 'day' : 'days'} (${formattedDateRange})`;
	} else if (selectedLanguageKey === 'Spanish') {
		// Spanish
		return `${index === 0 ? 'Tomar' : `Después tome`} ${row.dose}mg cada día durante ${row.daysForDose} ${row.daysForDose === 1 ? 'día' : 'días'} (${formattedDateRange})`;
	} else if (selectedLanguageKey === 'Haitian Creole') {
		// Haitian Creole
		return `${index === 0 ? 'Pran' : `Apre sa pran`} ${row.dose}mg chak jou pou ${row.daysForDose} ${row.daysForDose === 1 ? 'jou' : 'jou'} (${formattedDateRange})`;
	} else if (selectedLanguageKey === 'Mandarin') {
		// Mandarin
		return `${index === 0 ? '服用' : `然后服用`} ${row.dose}毫克，每天服用${row.daysForDose} ${row.daysForDose === 1 ? '天' : '天'} (${formattedDateRange})`;
	} else if (selectedLanguageKey === 'Swahili') {
		// Swahili
		return `${index === 0 ? 'Kutoka' : `Sasa kutoka`} ${row.dose}mg kwa saa ${row.daysForDose} ${row.daysForDose === 1 ? 'siku' : 'siku'} (${formattedDateRange})`;
	} else if (selectedLanguageKey === 'Arabic') {
		// Arabic
		return `${index === 0 ? 'احتياج' : `في ذلك الحين تحتاج`} ${row.dose}mg كل يوم ${row.daysForDose} ${row.daysForDose === 1 ? 'يوم' : 'يوم'} (${formattedDateRange})`;
	}

	return '';
};
