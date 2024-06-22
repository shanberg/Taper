import { describe, it, expect } from 'vitest';
import { getFormattedListForCopyPaste } from '../src/utils/scheduleUtils';

// Simplified dependencies
const getLanguageFromKey = (key: string) => {
  const languages = [
    { labelEn: 'English', lang: 'en', verified: true, dir: 'ltr' },
    { labelEn: 'Spanish', lang: 'es', verified: true, dir: 'ltr' },
  ];
  return languages.find(lang => lang.lang === key) || languages[0];
};

const isSegmentPlaceholder = (segment: { dose: number, daysForDose: number }): boolean => {
  return segment.dose === 0 && segment.daysForDose === 0;
};

const calculateSegmentStartAndEndDates = (schedule: any, index: number) => {
  const startDate = new Date(schedule.startDate);
  startDate.setUTCDate(startDate.getUTCDate() + index * 5);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + schedule.segments[index].daysForDose - 1);
  return { segment: schedule.segments[index], segmentStartDate: startDate, segmentEndDate: endDate };
};

const formatSegmentText = ({ segment, segmentStartDate, segmentEndDate, index, selectedLanguage }: any) => {
  return `Segment ${index + 1}: ${segment.dose} dose(s) from ${segmentStartDate.toUTCString()} to ${segmentEndDate.toUTCString()} in ${selectedLanguage.labelEn}`;
};

// Test data
const mockSchedule = {
  segments: [
    { dose: 10, daysForDose: 5 },
    { dose: 20, daysForDose: 3 },
    { dose: 30, daysForDose: 7 },
  ],
  startDate: new Date('2023-01-01T12:00:00.000Z'),
  templateKey: 'template1',
  languageKey: 'en',
};

const mockLanguage = { labelEn: 'English', lang: 'en', verified: true, dir: 'ltr' };

describe('getFormattedListForCopyPaste', () => {
  it('should format the schedule correctly', () => {
    const result = getFormattedListForCopyPaste(mockSchedule);
    const expected = `Take 10mg daily for 5 days (Jan 1, 2023 - Jan 5, 2023)
Then take 20mg daily for 3 days (Jan 6, 2023 - Jan 8, 2023)
Then take 30mg daily for 7 days (Jan 9, 2023 - Jan 15, 2023)`;
    expect(result).toEqual(expected);
  });

  it('should exclude placeholder segments', () => {
    const scheduleWithPlaceholder = {
      ...mockSchedule,
      segments: [
        ...mockSchedule.segments,
        { dose: 0, daysForDose: 0 },
      ],
    };

    const result = getFormattedListForCopyPaste(scheduleWithPlaceholder);
    const expected = `Take 10mg daily for 5 days (Jan 1, 2023 - Jan 5, 2023)
Then take 20mg daily for 3 days (Jan 6, 2023 - Jan 8, 2023)
Then take 30mg daily for 7 days (Jan 9, 2023 - Jan 15, 2023)`;
    expect(result).toEqual(expected);
  });

  it('should handle different languages', () => {
    const mockScheduleSpanish = {
      ...mockSchedule,
      languageKey: 'es',
    };

    const result = getFormattedListForCopyPaste(mockScheduleSpanish);
    const expected = `Tomar 10mg cada día durante 5 días (1 ene 2023 - 5 ene 2023)
Después tome 20mg cada día durante 3 días (6 ene 2023 - 8 ene 2023)
Después tome 30mg cada día durante 7 días (9 ene 2023 - 15 ene 2023)`;
    expect(result).toEqual(expected);
  });
});
