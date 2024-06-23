import { TaperDate } from '../TaperDate';

export const isStepInvalid = (step: Step): boolean => {
  return step.dose <= 0 || step.daysForDose <= 0;
};

/** Returns true if dose and daysForDose are both 0 */
export const isStepPlaceholder = (step: Step): boolean => {
  if (!step) return false;
  return step.dose === 0 && step.daysForDose === 0;
};

export const sumStepsDose = (steps: Step[]): number => {
  return steps.reduce((sum, step) => sum + step.dose * step.daysForDose, 0);
};

export const sumStepsDays = (steps: Step[]): number => {
  return steps.reduce((sum, step) => sum + step.daysForDose, 0);
};

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
  periodType: "half-day" | "day" | "week"
}

export function getPeriodsWithDosesForStep({ step, stepStartDate, periodType }: GetPeriodsWithDosesForStepParams): DayWithDose[] {
  const periodsWithDoses: DayWithDose[] = [];
  let currentDate = new Date(stepStartDate);

  switch (periodType) {
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
      throw new Error(`Unsupported period type: ${periodType}`);
  }

  return periodsWithDoses;
}