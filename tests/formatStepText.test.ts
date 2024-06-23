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

describe('formatStepText', () => {
	const step = { dose: 50, daysForDose: 5 };
	const stepStartDate = new TaperDate('2024-06-01').toScheduleDate();
	const stepEndDate = new TaperDate('2024-06-05').toScheduleDate();

	test('formats text for English language', () => {
		const result = formatStepText({
			step,
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: English
		});
		expect(result).toBe('Take 50mg daily for 5 days (Jun 1 - Jun 5)');
	});

	test('formats text for Spanish language', () => {
		const result = formatStepText({
			step,
			stepStartDate,
			stepEndDate,
			index: 1,
			selectedLanguage: Spanish
		});
		expect(result).toBe('Después tome 50mg cada día durante 5 días (1 jun - 5 jun)');
	});

	test('formats text for Haitian Creole language', () => {
		const result = formatStepText({
			step,
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: HaitianCreole
		});
		expect(result).toBe('Pran 50mg chak jou pou 5 jou (Jun 1 - Jun 5)');
	});

	test('formats text for Mandarin language', () => {
		const result = formatStepText({
			step,
			stepStartDate,
			stepEndDate,
			index: 1,
			selectedLanguage: Mandarin
		});
		expect(result).toBe('然后服用 50毫克，每天服用5 天 (6月1日 - 6月5日)');
	});

	test('formats text for Swahili language', () => {
		const result = formatStepText({
			step,
			stepStartDate,
			stepEndDate,
			index: 0,
			selectedLanguage: Swahili
		});
		expect(result).toBe('Kutoka 50mg kwa saa 5 siku (1 Jun - 5 Jun)');
	});

	test('formats text for Arabic language', () => {
		const result = formatStepText({
			step,
			stepStartDate,
			stepEndDate,
			index: 1,
			selectedLanguage: Arabic
		});
		expect(result).toBe('في ذلك الحين تحتاج 50mg كل يوم 5 يوم (٥ يونيو - ١ يونيو)');
	});

	test('returns empty string for unsupported language', () => {
		const result = formatStepText({
			step,
			stepStartDate,
			stepEndDate,
			index: 1,
			selectedLanguage: { labelEn: 'Unsupported Language', lang: 'xx', dir: 'ltr' }
		});

		expect(result).toBe('');
	});
});
