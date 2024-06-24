import { TaperDate } from '../TaperDate';

/**
 * Determines if a step is invalid based on its dose and duration values.
 * @param {Step} step - The step to validate.
 * @returns {boolean} - True if the step is invalid, false otherwise.
 */
export const isStepInvalid = (step: Step): boolean => {
  return step.dose <= 0 || step.duration <= 0;
};

/**
 * Checks if a step is a placeholder (both dose and duration are 0).
 * @param {Step} step - The step to check.
 * @returns {boolean} - True if the step is a placeholder, false otherwise.
 */
export const isStepPlaceholder = (step: Step): boolean => {
  if (!step) return false;
  if (step?.dose2 === undefined) {
    return step.dose === 0 && step.duration === 0;
  } else {
    return step.dose === 0 && step.dose2 === 0 && step.duration === 0;
  }
};

/**
 * Sums the total dose across all steps in a schedule.
 * @param {Step[]} steps - The steps of the schedule.
 * @returns {number} - The total dose.
 */
export const sumStepsDose = (steps: Step[]): number => {
  return steps.reduce((sum, step) => sum + step.dose * step.duration, 0);
};

/**
 * Sums the total number of days across all steps in a schedule.
 * @param {Step[]} steps - The steps of the schedule.
 * @returns {number} - The total number of days.
 */
export const sumStepsDays = (steps: Step[]): number => {
  return steps.reduce((sum, step) => sum + step.duration, 0);
};

/**
 * Determines if a step is directly after a placeholder step.
 * @param {Step[]} steps - The steps of the schedule.
 * @param {number} index - The index of the current step.
 * @returns {boolean} - True if the step is directly after a placeholder, false otherwise.
 */
export function isStepDirectlyAfterPlaceholder(steps: Step[], index: number) {
  const step = steps[index];
  if (!step) return false;

  if (index === -1) {
    return false;
  }

  const prevStep = steps[index - 1];
  if (!prevStep) return false;
  return isStepPlaceholder(prevStep);
}

/**
 * Determines if a step is or is directly after a placeholder step.
 * @param {Step[]} steps - The steps of the schedule.
 * @param {number} index - The index of the current step.
 * @returns {boolean} - True if the step is or is directly after a placeholder, false otherwise.
 */
export function stepIsOrAfterPlaceholder(steps: Step[], index: number) {
  const step = steps[index];

  if (!step) return false;
  if (isStepPlaceholder(step)) {
    return true;
  }
  if (isStepDirectlyAfterPlaceholder(steps, index)) {
    return true;
  }
  return false;
}

type GetPeriodsWithDosesForStepParams = {
  step: Step,
  stepStartDate: ScheduleDate,
  outputPeriodSize: "half-day" | "day" | "week"
}

export function getPeriodsWithDosesForStep({ step, stepStartDate, outputPeriodSize }: GetPeriodsWithDosesForStepParams): DayWithDose[] {
  const periodsWithDoses: DayWithDose[] = [];
  let currentDate = new Date(stepStartDate);

  switch (outputPeriodSize) {
    case 'half-day':
      for (let i = 0; i < step.duration; i++) {
        // Morning dose
        periodsWithDoses.push({
          date: new TaperDate(currentDate).toScheduleDate(),
          dose: step.dose / 2,
          period: 'in the morning',
        });
        currentDate.setHours(currentDate.getHours() + 12);

        // Evening dose
        periodsWithDoses.push({
          date: new TaperDate(currentDate).toScheduleDate(),
          dose: step.dose / 2,
          period: 'in the evening',
        });
        currentDate.setHours(currentDate.getHours() + 12);
      }
      break;
    case 'day':
      for (let i = 0; i < step.duration; i++) {
        periodsWithDoses.push({
          date: new TaperDate(currentDate).toScheduleDate(),
          dose: step.dose,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;
    case 'week':
      for (let i = 0; i < step.duration; i += 7) {
        periodsWithDoses.push({
          date: new TaperDate(currentDate).toScheduleDate(),
          dose: step.dose * Math.min(7, step.duration - i), // Handle cases where duration is not a multiple of 7
        });
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;
    default:
      throw new Error(`Unsupported period type: ${outputPeriodSize}`);
  }

  return periodsWithDoses;
}