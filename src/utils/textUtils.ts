import { cachedFormatDate } from './dateUtils';

type FormatSegmentTextParams = SegmentWithStartEndDate & {
  index: number;
  selectedLanguage: Language;
};

type SegmentPhrases = {
  first: string;
  then: string;
  middle: string;
  day: string;
  days: string;
};

const SEGMENT_PHRASES_BY_LANGUAGE: Record<string, SegmentPhrases> = {
  English: {
    first: 'Take',
    then: 'Then take',
    middle: 'daily for',
    day: 'day',
    days: 'days'
  },
  Spanish: {
    first: 'Tomar',
    then: 'Después tome',
    middle: 'cada día durante',
    day: 'día',
    days: 'días'
  },
  'Haitian Creole': {
    first: 'Pran',
    then: 'Apre sa pran',
    middle: 'chak jou pou',
    day: 'jou',
    days: 'jou'
  },
  Mandarin: {
    first: '服用',
    then: '然后服用',
    middle: '毫克，每天服用',
    day: '天',
    days: '天'
  },
  Swahili: {
    first: 'Kutoka',
    then: 'Sasa kutoka',
    middle: 'kwa saa',
    day: 'siku',
    days: 'siku'
  },
  Arabic: {
    first: 'احتياج',
    then: 'في ذلك الحين تحتاج',
    middle: 'كل يوم',
    day: 'يوم',
    days: 'يوم'
  }
};

/** Format segment content based on selected language */
export const formatSegmentText = ({
  segment,
  segmentStartDate,
  segmentEndDate,
  index,
  selectedLanguage
}: FormatSegmentTextParams): string => {
  const phrases = SEGMENT_PHRASES_BY_LANGUAGE[selectedLanguage.labelEn];
  if (!phrases) return '';

  const { lang, dir } = selectedLanguage;
  const dates = {
    start: cachedFormatDate(segmentStartDate, lang, { short: true }),
    end: cachedFormatDate(segmentEndDate, lang, { short: true })
  };
  const formattedDateRange =
    dir === 'ltr' ? `${dates.start} - ${dates.end}` : `${dates.end} - ${dates.start}`;

  const action = index === 0 ? phrases.first : phrases.then;
  const unit = segment.daysForDose === 1 ? phrases.day : phrases.days;

  if (selectedLanguage.labelEn === 'Mandarin') {
    return `${action} ${segment.dose}${phrases.middle}${segment.daysForDose} ${unit} (${formattedDateRange})`;
  }
  return `${action} ${segment.dose}mg ${phrases.middle} ${segment.daysForDose} ${unit} (${formattedDateRange})`;
};
