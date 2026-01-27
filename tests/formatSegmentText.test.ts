import { describe, test, expect } from 'vitest';
import { formatSegmentText } from '../src/utils';
import { LANGUAGES } from '../src/consts';
import { TaperDate } from '../src/TaperDate';

const segment = { dose: 50, daysForDose: 5 };
const segmentStartDate = new TaperDate('2024-06-01').toScheduleDate();
const segmentEndDate = new TaperDate('2024-06-05').toScheduleDate();

function getLanguageByLabelEn(labelEn: string) {
	const lang = LANGUAGES.find((l) => l.labelEn === labelEn);
	if (!lang) throw new Error(`Language not found: ${labelEn}`);
	return lang;
}

function runFormatTest(
	labelEn: string,
	index: number,
	expected: string
): void {
	const selectedLanguage = getLanguageByLabelEn(labelEn);
	const result = formatSegmentText({
		segment,
		segmentStartDate,
		segmentEndDate,
		index,
		selectedLanguage
	});
	expect(result).toBe(expected);
}

function expectFormattedRow(labelEn: string, index: number, expected: string): void {
	runFormatTest(labelEn, index, expected);
}

const FORMAT_SEGMENT_TEXT_CASES: [string, number, string][] = [
	['English', 0, 'Take 50mg daily for 5 days (Jun 1 - Jun 5)'],
	['Spanish', 1, 'Después tome 50mg cada día durante 5 días (1 jun - 5 jun)'],
	['Haitian Creole', 0, 'Pran 50mg chak jou pou 5 jou (Jun 1 - Jun 5)'],
	['Mandarin', 1, '然后服用 50毫克，每天服用5 天 (6月1日 - 6月5日)'],
	['Swahili', 0, 'Kutoka 50mg kwa saa 5 siku (1 Jun - 5 Jun)'],
	['Arabic', 1, 'في ذلك الحين تحتاج 50mg كل يوم 5 يوم (5 يونيو - 1 يونيو)']
];

describe('formatSegmentText', () => {
	test.each(FORMAT_SEGMENT_TEXT_CASES)(
		'formats text for %s (index %i)',
		expectFormattedRow
	);

	test('returns empty string for unsupported language', () => {
		const result = formatSegmentText({
			segment,
			segmentStartDate,
			segmentEndDate,
			index: 1,
			selectedLanguage: { labelEn: 'Unsupported Language', lang: 'xx', dir: 'ltr' }
		});

		expect(result).toBe('');
	});
});
