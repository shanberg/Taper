/**
 * @fileoverview Schedule-related utilities: initial schedule creation, validation, summaries,
 * segment date calculations, and copy-paste formatting.
 */
import { TaperDate } from '../TaperDate';
import { TEMPLATES, DEFAULT_LANGUAGE_KEY, DEFAULT_TEMPLATE_KEY } from '../consts';
import { isSegmentInvalid, sumSegmentsDays, sumSegmentsDose, isSegmentPlaceholder } from './segmentUtils';
import { formatSegmentText } from './textUtils';
import { getLanguageFromKey } from './languageUtils';

/**
 * Sentinel segment for "add row" in schedule; last segment is always a placeholder.
 * @description Segment with dose 0 and daysForDose 0.
 */
const PLACEHOLDER_SEGMENT: Segment = { dose: 0, daysForDose: 0 };

/**
 * Returns a new schedule with the default template and one placeholder segment.
 * @description Uses TEMPLATES.Default, today as start date, and DEFAULT_LANGUAGE_KEY.
 * @returns New Schedule with default template key, language key, and start date
 */
export function createInitialSchedule(): Schedule {
  return {
    segments: [...TEMPLATES.Default, PLACEHOLDER_SEGMENT],
    startDate: new TaperDate().toScheduleDate(),
    templateKey: DEFAULT_TEMPLATE_KEY,
    languageKey: DEFAULT_LANGUAGE_KEY
  };
}

/**
 * Returns true if every non-placeholder segment has valid dose and days; throws if schedule is null/undefined.
 * @description Validates all segments except the final placeholder.
 * @param schedule - The schedule to validate
 * @returns True if all non-placeholder segments have valid dose and days
 */
export function isValidSchedule(schedule: Schedule): boolean {
  if (!schedule) {
    throw new Error("No schedule provided");
  }
  return !schedule.segments.slice(0, schedule.segments.length - 1).some(s => isSegmentInvalid(s));
}

/**
 * Returns a short summary string: "{totalMg}mg over {totalDays} days".
 * @description Sums dose and days from all segments (including placeholder).
 * @param schedule - The schedule to summarize
 * @returns Summary string
 */
export function calculateScheduleSummary(schedule: Schedule): string {
  return `${sumSegmentsDose(schedule.segments)}mg over ${sumSegmentsDays(schedule.segments)} days`
};

/**
 * Computes the start and end dates for the segment at the given index based on the schedule start date.
 * @description Walks segments before index to compute cumulative days, then returns segment with start/end as ScheduleDate.
 * @param schedule - The schedule containing segments and start date
 * @param index - Index of the segment
 * @returns The segment plus its start and end dates
 */
export function calculateSegmentStartAndEndDates(schedule: Schedule, index: number): SegmentWithStartEndDate {
  const segment = schedule.segments[index];
  const taperStartDate = new TaperDate(schedule.startDate);
  const totalDaysForStartDate =
    schedule.segments
      .slice(0, index)
      .reduce((acc: number, curr: { daysForDose: number }) => acc + curr.daysForDose - 1, 0) +
    index;
  taperStartDate.incrementByDays(totalDaysForStartDate);
  const taperEndDate = new TaperDate(taperStartDate.toScheduleDate());
  taperEndDate.incrementByDays(segment.daysForDose - 1);

  return {
    segment,
    segmentStartDate: taperStartDate.toScheduleDate(),
    segmentEndDate: taperEndDate.toScheduleDate()
  }
}

/**
 * Produces a newline-separated list of formatted segment lines for copy-paste, using the schedule's language.
 * @description Placeholder segments are omitted; each line uses formatSegmentText for the segment at its index.
 * @param schedule - The schedule (segments, start date, language key)
 * @returns Formatted string, one line per segment
 */
export function getFormattedListForCopyPaste(schedule: Schedule): string {
  const { segments, languageKey } = schedule;
  const selectedLanguage = getLanguageFromKey(languageKey);

  // Filter out placeholder segments
  const validSegments = segments.filter(segment => !isSegmentPlaceholder(segment));

  // Format each segment
  const formattedSegments = validSegments.map((segment, index) => {
    const { segmentStartDate, segmentEndDate } = calculateSegmentStartAndEndDates(schedule, index);

    return formatSegmentText({
      segment,
      segmentStartDate,
      segmentEndDate,
      index,
      selectedLanguage
    });
  });

  // Combine formatted segments into a single string
  return formattedSegments.join('\n');
}
