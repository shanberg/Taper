/**
 * @fileoverview Builds a single segment line string from params (action, dose, dates, language).
 */
import { cachedFormatDate } from './dateUtils';
import {
  SEGMENT_PHRASES_BY_LANGUAGE,
  type SegmentPhrases
} from './segmentPhrases';

export type FormatSegmentTextParams = SegmentWithStartEndDate & {
  index: number;
  selectedLanguage: Language;
};

function getFormattedDateRange(
  segmentStartDate: ScheduleDate,
  segmentEndDate: ScheduleDate,
  lang: string,
  dir: 'ltr' | 'rtl'
): string {
  const start = cachedFormatDate(segmentStartDate, lang, { short: true });
  const end = cachedFormatDate(segmentEndDate, lang, { short: true });
  return dir === 'ltr' ? `${start} - ${end}` : `${end} - ${start}`;
}

function getActionWord(index: number, phrases: SegmentPhrases): string {
  return index === 0 ? phrases.first : phrases.then;
}

function getUnitWord(daysForDose: number, phrases: SegmentPhrases): string {
  return daysForDose === 1 ? phrases.day : phrases.days;
}

function getSegmentLineDisplayParts(
  segmentStartDate: ScheduleDate,
  segmentEndDate: ScheduleDate,
  selectedLanguage: { lang: string; dir: 'ltr' | 'rtl'; labelEn: string },
  phrases: SegmentPhrases
): { inParens: string; middle: string; isMandarin: boolean } {
  const formattedDateRange = getFormattedDateRange(
    segmentStartDate,
    segmentEndDate,
    selectedLanguage.lang,
    selectedLanguage.dir
  );
  return {
    inParens: `(${formattedDateRange})`,
    middle: phrases.middle,
    isMandarin: selectedLanguage.labelEn === 'Mandarin'
  };
}

function buildSegmentLine(
  action: string,
  dose: number,
  days: number,
  unit: string,
  inParens: string,
  middle: string,
  isMandarin: boolean
): string {
  if (isMandarin) {
    return `${action} ${dose}${middle}${days} ${unit} ${inParens}`;
  }
  return `${action} ${dose}mg ${middle} ${days} ${unit} ${inParens}`;
}

type BuildSegmentLineArgs = Parameters<typeof buildSegmentLine>;

/**
 * Computes the seven arguments for buildSegmentLine from params, or null if language has no phrases.
 * @param params - Segment with dates, index, and selected language
 * @returns Tuple for buildSegmentLine, or null when phrases are missing
 */
function getSegmentLineArgs(params: FormatSegmentTextParams): BuildSegmentLineArgs | null {
  const { segment, segmentStartDate, segmentEndDate, index, selectedLanguage } = params;
  const phrases = SEGMENT_PHRASES_BY_LANGUAGE[selectedLanguage.labelEn];
  if (!phrases) return null;

  const action = getActionWord(index, phrases);
  const unit = getUnitWord(segment.daysForDose, phrases);
  const { inParens, middle, isMandarin } = getSegmentLineDisplayParts(
    segmentStartDate,
    segmentEndDate,
    selectedLanguage,
    phrases
  );

  return [action, segment.dose, segment.daysForDose, unit, inParens, middle, isMandarin];
}

/**
 * Format segment content based on selected language.
 * @param params - Segment with dates, index, and selected language
 * @returns Formatted line or empty string if language has no phrases
 */
export function formatSegmentText(params: FormatSegmentTextParams): string {
  const args = getSegmentLineArgs(params);
  return args ? buildSegmentLine(...args) : '';
}
