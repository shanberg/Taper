import { describe, test, expect } from 'vitest';
import { formatStepText } from '../src/utils';
import { LANGUAGES } from '../src/consts';
import { TaperDate } from '../src/TaperDate';

const English = LANGUAGES.find((language) => language.labelEn === 'English');
const Spanish = LANGUAGES.find((language) => language.labelEn === 'Spanish');
const HaitianCreole = LANGUAGES.find((language) => language.labelEn === 'Haitian Creole');
const Mandarin = LANGUAGES.find((language) => language.labelEn === 'Mandarin');
const Swahili = LANGUAGES.find((language) => language.labelEn === 'Swahili');
const Arabic = LANGUAGES.find((language) => language.labelEn === 'Arabic');


const stepStartDate = new TaperDate('2024-01-01').toScheduleDate();
const stepEndDate = new TaperDate('2024-01-03').toScheduleDate();

describe('formatStepText', () => {
	const languages = [
		{ labelEn: 'English', lang: 'en-US', dir: 'ltr' },
		{ labelEn: 'Spanish', lang: 'es', dir: 'ltr' },
		{ labelEn: 'Haitian Creole', lang: 'ht', dir: 'ltr' },
		{ labelEn: 'Mandarin', lang: 'zh', dir: 'ltr' },
		{ labelEn: 'Swahili', lang: 'sw', dir: 'ltr' },
		{ labelEn: 'Arabic', lang: 'ar', dir: 'rtl' }
	];

	const stepTypes: StepType[] = ["Twice Daily", "Daily", "Twice Weekly", "Weekly"];
	const doses = [10, 20, 50];
	const durations = [1, 3, 7];

	languages.forEach(language => {
		stepTypes.forEach(stepType => {
			doses.forEach(dose => {
				durations.forEach(duration => {
					test(`formats text correctly for ${language.labelEn} (${language.lang}), step type ${stepType}, dose ${dose}mg, duration ${duration}`, () => {
						const result = formatStepText({
							step: { dose, duration, stepType },
							stepType,
							stepStartDate,
							stepEndDate,
							index: 0,
							selectedLanguage: language
						});

						expect(result).toMatchSnapshot();
					});
				});
			});
		});
	});

	test('throws TypeError for unsupported language', () => {
		expect(() => {
			formatStepText({
				step: { dose: 20, duration: 3, stepType: "Daily" },
				stepType: "Daily",
				stepStartDate,
				stepEndDate,
				index: 1,
				selectedLanguage: { labelEn: 'Unsupported Language', lang: 'xx', dir: 'ltr' }
			});
		}).toThrow(TypeError);
	});

	test('formats text correctly for the first step', () => {
		const result = formatStepText({
			step: { dose: 20, duration: 3, stepType: "Daily" },
			stepType: "Daily",
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});

		expect(result).toBe('Take 20mg daily for 3 days (Jan 1 - Jan 3)');
	});

	test('formats text correctly for a subsequent step', () => {
		const result = formatStepText({
			step: { dose: 20, duration: 3, stepType: "Daily" },
			stepType: "Daily",
			stepStartDate,
			stepEndDate,
			index: 1,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});

		expect(result).toBe('Then take 20mg daily for 3 days (Jan 1 - Jan 3)');
	});

	test('formats text correctly for a single day duration', () => {
		const result = formatStepText({
			step: { dose: 20, duration: 1, stepType: "Daily" },
			stepType: "Daily",
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});

		expect(result).toBe('Take 20mg daily for 1 day (Jan 1 - Jan 3)');
	});

	test('formats text correctly for a single half-day duration', () => {
		const result = formatStepText({
			step: { dose: 20, duration: 1, stepType: "Twice Daily" },
			stepType: "Twice Daily",
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});

		expect(result).toBe('Take 20mg twice daily for 1 half-day (Jan 1 - Jan 3)');
	});

	test('formats text correctly for a single half-week duration', () => {
		const result = formatStepText({
			step: { dose: 20, duration: 1, stepType: "Twice Weekly" },
			stepType: "Twice Weekly",
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});
		expect(result).toBe('Take 20mg twice weekly for 1 half-week (Jan 1 - Jan 3)');
	});

	test('formats text correctly for a single week duration', () => {
		const result = formatStepText({
			step: { dose: 20, duration: 1, stepType: "Weekly" },
			stepType: "Weekly",
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});

		expect(result).toBe('Take 20mg weekly for 1 week (Jan 1 - Jan 3)');
	});

	test('formats text correctly for varying start and end dates', () => {
		const result = formatStepText({
			step: { dose: 20, duration: 3, stepType: "Daily" },
			stepType: "Daily",
			stepStartDate: new TaperDate('2024-02-01').toScheduleDate(),
			stepEndDate: new TaperDate('2024-02-03').toScheduleDate(),
			index: 0,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});

		expect(result).toBe('Take 20mg daily for 3 days (Feb 1 - Feb 3)');
	});

	test('formats text correctly for varying doses', () => {
		const result = formatStepText({
			step: { dose: 50, duration: 3, stepType: "Daily" },
			stepType: "Daily",
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});

		expect(result).toBe('Take 50mg daily for 3 days (Jan 1 - Jan 3)');
	});

	test('formats text correctly for varying durations', () => {
		const result = formatStepText({
			step: { dose: 20, duration: 7, stepType: "Daily" },
			stepType: "Daily",
			stepStartDate,
			stepEndDate: new TaperDate('2024-01-07').toScheduleDate(),
			index: 0,
			selectedLanguage: { labelEn: 'English', lang: 'en-US', dir: 'ltr' }
		});

		expect(result).toBe('Take 20mg daily for 7 days (Jan 1 - Jan 7)');
	});
});
