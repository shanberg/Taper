/**
 * @fileoverview Per-language phrase sets for segment text formatting.
 */

export type SegmentPhrases = {
  first: string;
  then: string;
  middle: string;
  day: string;
  days: string;
};

/** Phrases by language label (English key) for formatSegmentText. */
export const SEGMENT_PHRASES_BY_LANGUAGE: Record<string, SegmentPhrases> = {
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
