import { TaperDate } from '../TaperDate';
import { TEMPLATES, DEFAULT_LANGUAGE_KEY, DEFAULT_TEMPLATE_KEY } from '../consts';
import { isStepInvalid, sumStepsDays, sumStepsDose, isStepPlaceholder } from './stepUtils';
import { formatStepText } from './textUtils';
import { getLanguageFromKey } from './languageUtils';

const PLACEHOLDER_SEGMENT: Step = { dose: 0, daysForDose: 0 };

export function createInitialSchedule(): Schedule {
  return {
    steps: [...TEMPLATES.Default, PLACEHOLDER_SEGMENT],
    startDate: new TaperDate().toScheduleDate(),
    templateKey: DEFAULT_TEMPLATE_KEY,
    languageKey: DEFAULT_LANGUAGE_KEY,
    displayMode: "steps"
  };
}

export function isValidSchedule(schedule: Schedule): boolean {
  if (!schedule) {
    throw new Error("No schedule provided");
  }
  return !schedule.steps.slice(0, schedule.steps.length - 1).some(s => isStepInvalid(s));
}

export function calculateScheduleSummary(schedule: Schedule): string {
  return `${sumStepsDose(schedule.steps)}mg over ${sumStepsDays(schedule.steps)} days`
};

export function calculateStepStartAndEndDates(schedule: Schedule, index: number): StepWithStartEndDate {
  const step = schedule.steps[index];
  const taperStartDate = new TaperDate(schedule.startDate);
  const totalDaysForStartDate =
    schedule.steps
      .slice(0, index)
      .reduce((acc: number, curr: { daysForDose: number }) => acc + curr.daysForDose - 1, 0) +
    index;
  taperStartDate.incrementByDays(totalDaysForStartDate);
  const taperEndDate = new TaperDate(taperStartDate.toScheduleDate());
  taperEndDate.incrementByDays(step.daysForDose - 1);

  return {
    step,
    stepStartDate: taperStartDate.toScheduleDate(),
    stepEndDate: taperEndDate.toScheduleDate()
  }
}

export function getFormattedListForCopyPaste(schedule: Schedule): string {
  const { steps, languageKey } = schedule;
  const selectedLanguage = getLanguageFromKey(languageKey);

  // Filter out placeholder steps
  const validSteps = steps.filter(step => !isStepPlaceholder(step));

  // Format each step
  const formattedSteps = validSteps.map((step, index) => {
    const { stepStartDate, stepEndDate } = calculateStepStartAndEndDates(schedule, index);

    return formatStepText({
      step,
      stepStartDate,
      stepEndDate,
      index,
      selectedLanguage
    });
  });

  // Combine formatted steps into a single string
  return formattedSteps.join('\n');
}
