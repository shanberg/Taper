export const TEMPLATES: Record<string, Template[]> = {
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
};

export const DEFAULT_TEMPLATE_KEY: string = Object.keys(TEMPLATES)[0];

export const LANGUAGES: Language[] = [
	{ labelEn: 'English', lang: 'en-US', verified: true, dir: 'ltr' },
	{ labelEn: 'Spanish', lang: 'es', verified: true, dir: 'ltr' },
	{ labelEn: 'Mandarin', lang: 'zh', verified: false, dir: 'ltr' },
	{ labelEn: 'Haitian Creole', lang: 'ht', verified: false, dir: 'ltr' },
	{ labelEn: 'Swahili', lang: 'sw', verified: false, dir: 'ltr' },
	{ labelEn: 'Arabic', lang: 'ar', verified: false, dir: 'rtl' }
];

export const DEFAULT_LANGUAGE_KEY: string = LANGUAGES[0].lang;

export const PLACEHOLDER_SEGMENT: Segment = { dose: 0, daysForDose: 0 };
