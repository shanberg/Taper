import { TaperDate } from '../TaperDate';

/**
 * Determines if a step is invalid based on its dose and daysForDose values.
 * @param {Step} step - The step to validate.
 * @returns {boolean} - True if the step is invalid, false otherwise.
 */
export const isStepInvalid = (step: Step): boolean => {
  return step.dose <= 0 || step.daysForDose <= 0;
};

/**
 * Checks if a step is a placeholder (both dose and daysForDose are 0).
 * @param {Step} step - The step to check.
 * @returns {boolean} - True if the step is a placeholder, false otherwise.
 */
export const isStepPlaceholder = (step: Step): boolean => {
  if (!step) return false;
  return step.dose === 0 && step.daysForDose === 0;
};

/**
 * Sums the total dose across all steps in a schedule.
 * @param {Step[]} steps - The steps of the schedule.
 * @returns {number} - The total dose.
 */
export const sumStepsDose = (steps: Step[]): number => {
  return steps.reduce((sum, step) => sum + step.dose * step.daysForDose, 0);
};

/**
 * Sums the total number of days across all steps in a schedule.
 * @param {Step[]} steps - The steps of the schedule.
 * @returns {number} - The total number of days.
 */
export const sumStepsDays = (steps: Step[]): number => {
  return steps.reduce((sum, step) => sum + step.daysForDose, 0);
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
  periodSize: "half-day" | "day" | "week"
}

export function getPeriodsWithDosesForStep({ step, stepStartDate, periodSize }: GetPeriodsWithDosesForStepParams): DayWithDose[] {
  const periodsWithDoses: DayWithDose[] = [];
  let currentDate = new Date(stepStartDate);

  switch (periodSize) {
    case 'half-day':
      for (let i = 0; i < step.daysForDose; i++) {
        // Two half-day doses for each day
        for (let j = 0; j < 2; j++) {
          periodsWithDoses.push({
            date: new TaperDate(currentDate).toScheduleDate(),
            dose: step.dose / 2,
          });
          currentDate.setHours(currentDate.getHours() + 12);
        }
      }
      break;
    case 'day':
      for (let i = 0; i < step.daysForDose; i++) {
        periodsWithDoses.push({
          date: new TaperDate(currentDate).toScheduleDate(),
          dose: step.dose,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      break;
    case 'week':
      for (let i = 0; i < step.daysForDose; i += 7) {
        periodsWithDoses.push({
          date: new TaperDate(currentDate).toScheduleDate(),
          dose: step.dose * Math.min(7, step.daysForDose - i), // Handle cases where daysForDose is not a multiple of 7
        });
        currentDate.setDate(currentDate.getDate() + 7);
      }
      break;
    default:
      throw new Error(`Unsupported period type: ${periodSize}`);
  }

  return periodsWithDoses;
}