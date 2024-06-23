import { cachedFormatDate } from './dateUtils';

type FormatStepTextParams = StepWithStartEndDate & {
  index: number;
  selectedLanguage: Language;
};

/** Format step content based on selected language */
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

  if (selectedLanguage.labelEn === 'English') {
    // English
    return `${index === 0 ? 'Take' : `Then take`} ${step.dose}mg daily for ${step.daysForDose} ${step.daysForDose === 1 ? 'day' : 'days'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Spanish') {
    // Spanish
    return `${index === 0 ? 'Tomar' : `Después tome`} ${step.dose}mg cada día durante ${step.daysForDose} ${step.daysForDose === 1 ? 'día' : 'días'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Haitian Creole') {
    // Haitian Creole
    return `${index === 0 ? 'Pran' : `Apre sa pran`} ${step.dose}mg chak jou pou ${step.daysForDose} ${step.daysForDose === 1 ? 'jou' : 'jou'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Mandarin') {
    // Mandarin
    return `${index === 0 ? '服用' : `然后服用`} ${step.dose}毫克，每天服用${step.daysForDose} ${step.daysForDose === 1 ? '天' : '天'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Swahili') {
    // Swahili
    return `${index === 0 ? 'Kutoka' : `Sasa kutoka`} ${step.dose}mg kwa saa ${step.daysForDose} ${step.daysForDose === 1 ? 'siku' : 'siku'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Arabic') {
    // Arabic
    return `${index === 0 ? 'احتياج' : `في ذلك الحين تحتاج`} ${step.dose}mg كل يوم ${step.daysForDose} ${step.daysForDose === 1 ? 'يوم' : 'يوم'} (${formattedDateRange})`;
  }

  return '';
};

type FormatPeriodTextParams = {
  step: Step;
  stepStartDate: ScheduleDate;
  periodType: 'half-day' | 'day' | 'week';
  index: number;
  selectedLanguage: Language;
};

/** Format period content based on selected language */
export const formatPeriodText = ({
  step,
  stepStartDate,
  periodType,
  index,
  selectedLanguage
}: FormatPeriodTextParams): string => {
  const { lang, dir } = selectedLanguage;

  const formattedStartDate = cachedFormatDate(stepStartDate, lang);

  let periodDescription = '';
  let doseDescription = '';

  switch (periodType) {
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
      throw new Error(`Unsupported period type: ${periodType}`);
  }

  const formattedText: Record<Language['labelEn'], string> = {
    English: `${index === 0 ? 'Take' : 'Then take'} ${doseDescription} ${periodDescription} on ${formattedStartDate}`,
    Spanish: `${index === 0 ? 'Tomar' : 'Después tome'} ${doseDescription} ${periodDescription} el ${formattedStartDate}`,
    'Haitian Creole': `${index === 0 ? 'Pran' : 'Apre sa pran'} ${doseDescription} ${periodDescription} sou ${formattedStartDate}`,
    Mandarin: `${index === 0 ? '服用' : '然后服用'} ${doseDescription} ${periodDescription} 在 ${formattedStartDate}`,
    Swahili: `${index === 0 ? 'Chukua' : 'Kisha chukua'} ${doseDescription} ${periodDescription} tarehe ${formattedStartDate}`,
    Arabic: `${index === 0 ? 'خذ' : 'ثم خذ'} ${doseDescription} ${periodDescription} في ${formattedStartDate}`
  };

  return formattedText[selectedLanguage.labelEn] || '';
};
