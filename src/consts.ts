export const TEMPLATES = {
	Default: [
		{ dose: 20, daysForDose: 5 },
		{ dose: 15, daysForDose: 5 },
		{ dose: 10, daysForDose: 5 },
		{ dose: 5, daysForDose: 5 }
	],
	'Giacta 6-month taper': [
		{ dose: 60, daysForDose: 7 },
		{ dose: 50, daysForDose: 7 },
		{ dose: 40, daysForDose: 7 },
		{ dose: 35, daysForDose: 7 },
		{ dose: 30, daysForDose: 7 },
		{ dose: 25, daysForDose: 7 },
		{ dose: 20, daysForDose: 7 },
		{ dose: 15, daysForDose: 7 },
		{ dose: 12.5, daysForDose: 14 },
		{ dose: 10, daysForDose: 7 },
		{ dose: 9, daysForDose: 7 },
		{ dose: 8, daysForDose: 7 },
		{ dose: 7, daysForDose: 7 },
		{ dose: 6, daysForDose: 14 },
		{ dose: 5, daysForDose: 14 },
		{ dose: 4, daysForDose: 14 },
		{ dose: 3, daysForDose: 14 },
		{ dose: 2, daysForDose: 14 },
		{ dose: 1, daysForDose: 14 }
	],
	'Giacta 12-month taper': [
		{ dose: 60, daysForDose: 7 },
		{ dose: 50, daysForDose: 7 },
		{ dose: 40, daysForDose: 7 },
		{ dose: 35, daysForDose: 7 },
		{ dose: 30, daysForDose: 7 },
		{ dose: 25, daysForDose: 7 },
		{ dose: 20, daysForDose: 7 },
		{ dose: 17.5, daysForDose: 14 },
		{ dose: 15, daysForDose: 14 },
		{ dose: 12.5, daysForDose: 7 },
		{ dose: 10, daysForDose: 28 },
		{ dose: 9, daysForDose: 28 },
		{ dose: 8, daysForDose: 28 },
		{ dose: 7, daysForDose: 28 },
		{ dose: 6, daysForDose: 28 },
		{ dose: 5, daysForDose: 28 },
		{ dose: 4, daysForDose: 28 },
		{ dose: 3, daysForDose: 28 },
		{ dose: 2, daysForDose: 28 },
		{ dose: 1, daysForDose: 28 }
	],
	'PMR taper': [
		{ dose: 15, daysForDose: 14 },
		{ dose: 12.5, daysForDose: 14 },
		{ dose: 10, daysForDose: 14 },
		{ dose: 9, daysForDose: 30 },
		{ dose: 8, daysForDose: 30 },
		{ dose: 7, daysForDose: 30 },
		{ dose: 6, daysForDose: 30 },
		{ dose: 5, daysForDose: 90 },
		{ dose: 4, daysForDose: 30 },
		{ dose: 3, daysForDose: 30 },
		{ dose: 2, daysForDose: 30 },
		{ dose: 1, daysForDose: 30 }
	]
} as Record<string, Template[]>;

export const LANGUAGES = {
	English: { lang: 'en-US', verified: true, dir: 'ltr' },
	Spanish: { lang: 'es', verified: true, dir: 'ltr' },
	Mandarin: { lang: 'zh', verified: false, dir: 'ltr' },
	'Haitian Creole': { lang: 'ht', verified: false, dir: 'ltr' },
	Swahili: { lang: 'sw', verified: false, dir: 'ltr' },
	Arabic: { lang: 'ar', verified: false, dir: 'rtl' }
} as Record<string, Language>;
