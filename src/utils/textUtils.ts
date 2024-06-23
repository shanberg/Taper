import { cachedFormatDate } from './dateUtils';

type FormatStepTextParams = StepWithStartEndDate & {
  index: number;
  selectedLanguage: Language;
};

/**
 * Formats the text for a step in the schedule, considering the selected language and directionality.
 * @param {FormatStepTextParams} params - Parameters including step details and language settings.
 * @returns {string} - The formatted step text.
 */
export const formatStepText = ({
  step,
  stepStartDate,
  stepEndDate,
  index,
  selectedLanguage
}: FormatStepTextParams): string => {
  const { lang, dir } = selectedLanguage;

  const dates = {
    start: cachedFormatDate(stepStartDate, lang),
    end: cachedFormatDate(stepEndDate, lang)
  };
  const formattedDateRange =
    dir === 'ltr' ? `${dates.start} - ${dates.end}` : `${dates.end} - ${dates.start}`;

  // Optimized for performance by reducing conditionals and direct access to language properties
  const stepTextTemplates: Record<Language['lang'], string> = {
    'en-US': `${index === 0 ? 'Take' : `Then take`} ${step.dose}mg daily for ${step.daysForDose} ${step.daysForDose === 1 ? 'day' : 'days'} (${formattedDateRange})`,
    'es': `${index === 0 ? 'Tomar' : `Después tome`} ${step.dose}mg cada día durante ${step.daysForDose} ${step.daysForDose === 1 ? 'día' : 'días'} (${formattedDateRange})`,
    'ht': `${index === 0 ? 'Pran' : `Apre sa pran`} ${step.dose}mg chak jou pou ${step.daysForDose} ${step.daysForDose === 1 ? 'jou' : 'jou'} (${formattedDateRange})`,
    'zh': `${index === 0 ? '服用' : `然后服用`} ${step.dose}毫克，每天服用${step.daysForDose} ${step.daysForDose === 1 ? '天' : '天'} (${formattedDateRange})`,
    'sw': `${index === 0 ? 'Kutoka' : `Sasa kutoka`} ${step.dose}mg kwa saa ${step.daysForDose} ${step.daysForDose === 1 ? 'siku' : 'siku'} (${formattedDateRange})`,
    'ar': `${index === 0 ? 'احتياج' : `في ذلك الحين تحتاج`} ${step.dose}mg كل يوم ${step.daysForDose} ${step.daysForDose === 1 ? 'يوم' : 'يوم'} (${formattedDateRange})`
  };

  return stepTextTemplates[selectedLanguage.lang] || '';
};

type FormatPeriodTextParams = {
  step: Step;
  stepStartDate: ScheduleDate;
  periodSize: PeriodSize;
  index: number;
  selectedLanguage: Language;
};

/**
 * Formats the text for a period within a step, considering the selected language and directionality.
 * @param {FormatPeriodTextParams} params - Parameters including step details and language settings.
 * @returns {string} - The formatted period text.
 */
export const formatPeriodText = ({
  step,
  stepStartDate,
  periodSize,
  index,
  selectedLanguage
}: FormatPeriodTextParams): string => {
  const { lang, dir } = selectedLanguage;

  const formattedStartDate = cachedFormatDate(stepStartDate, lang);

  let periodDescription = '';
  let doseDescription = '';

  switch (periodSize) {
    case 'half-day':
      periodDescription = selectedLanguage.labelEn === 'English' ? 'every 12 hours' : 'cada 12 horas';
      doseDescription = `${step.dose / 2}mg`;
      break;
    case 'day':
      periodDescription = "";
      doseDescription = `${step.dose}mg`;
      break;
    case 'week':
      periodDescription = selectedLanguage.labelEn === 'English' ? 'on the week starting' : 'en la semana comenzando';
      doseDescription = `${step.dose * 7}mg`;
      break;
    default:
      throw new Error(`Unsupported period type: ${periodSize}`);
  }

  const periodTextTemplates: Record<Language['lang'], string> = {
    'en-US': `${index === 0 ? 'Take' : 'Then take'} ${doseDescription} ${periodDescription} on ${formattedStartDate}`,
    'es': `${index === 0 ? 'Tomar' : 'Después tome'} ${doseDescription} ${periodDescription} el ${formattedStartDate}`,
    'ht': `${index === 0 ? 'Pran' : 'Apre sa pran'} ${doseDescription} ${periodDescription} sou ${formattedStartDate}`,
    'zh': `${index === 0 ? '服用' : '然后服用'} ${doseDescription} ${periodDescription} 在 ${formattedStartDate}`,
    'sw': `${index === 0 ? 'Chukua' : 'Kisha chukua'} ${doseDescription} ${periodDescription} tarehe ${formattedStartDate}`,
    'ar': `${index === 0 ? 'خذ' : 'ثم خذ'} ${doseDescription} ${periodDescription} في ${formattedStartDate}`
  };

  return periodTextTemplates[selectedLanguage.lang] || '';
};
