import { TaperDate } from '../TaperDate';
import { TEMPLATES, DEFAULT_LANGUAGE_KEY, DEFAULT_TEMPLATE_KEY } from '../consts';
import { isSegmentInvalid, sumSegmentsDays, sumSegmentsDose, isSegmentPlaceholder } from './segmentUtils';
import { formatSegmentText } from './textUtils';
import { getLanguageFromKey } from './languageUtils';

const PLACEHOLDER_SEGMENT: Segment = { dose: 0, daysForDose: 0 };

export function createInitialSchedule(): Schedule {
  return {
    segments: [...TEMPLATES.Default, PLACEHOLDER_SEGMENT],
    startDate: new TaperDate().toScheduleDate(),
    templateKey: DEFAULT_TEMPLATE_KEY,
    languageKey: DEFAULT_LANGUAGE_KEY,
    displayMode: "segments"
  };
}

export function isValidSchedule(schedule: Schedule): boolean {
  if (!schedule) {
    throw new Error("No schedule provided");
  }
  return !schedule.segments.slice(0, schedule.segments.length - 1).some(s => isSegmentInvalid(s));
}

export function calculateScheduleSummary(schedule: Schedule): string {
  return `${sumSegmentsDose(schedule.segments)}mg over ${sumSegmentsDays(schedule.segments)} days`
};

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
