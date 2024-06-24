import { cachedFormatDate } from './dateUtils';

type FormatStepTextParams = StepWithStartEndDate & {
  index: number;
  stepType: StepType;
  selectedLanguage: Language;
};


/**
 * Formats the text for a step in the schedule, considering the selected language and directionality.
 * @param {FormatStepTextParams} params - Parameters including step details and language settings.
 * @returns {string} - The formatted step text.
 */
export const formatStepText = ({
  step,
  stepType,
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

  const stepTypeText: Record<Language['lang'], Record<StepType, string>> = {
    'en-US': {
      "Twice Daily": "twice daily",
      "Daily": "daily",
      "Twice Weekly": "twice weekly",
      "Weekly": "weekly"
    },
    'es': {
      "Twice Daily": "dos veces al día",
      "Daily": "cada día",
      "Twice Weekly": "dos veces por semana",
      "Weekly": "semanal"
    },
    'ht': {
      "Twice Daily": "de fwa pa jou",
      "Daily": "chak jou",
      "Twice Weekly": "de fwa pa semèn",
      "Weekly": "chak semèn"
    },
    'zh': {
      "Twice Daily": "每天两次",
      "Daily": "每天",
      "Twice Weekly": "每周两次",
      "Weekly": "每周"
    },
    'sw': {
      "Twice Daily": "mara mbili kwa siku",
      "Daily": "kila siku",
      "Twice Weekly": "mara mbili kwa wiki",
      "Weekly": "kila wiki"
    },
    'ar': {
      "Twice Daily": "مرتين يوميا",
      "Daily": "يوميا",
      "Twice Weekly": "مرتين في الأسبوع",
      "Weekly": "أسبوعيا"
    }
  };

  const durationUnit: Record<Language['lang'], Record<StepType, string>> = {
    'en-US': {
      "Twice Daily": "half-days",
      "Daily": "days",
      "Twice Weekly": "half-weeks",
      "Weekly": "weeks"
    },
    'es': {
      "Twice Daily": "medios días",
      "Daily": "días",
      "Twice Weekly": "medias semanas",
      "Weekly": "semanas"
    },
    'ht': {
      "Twice Daily": "mwatye jou",
      "Daily": "jou",
      "Twice Weekly": "mwatye semèn",
      "Weekly": "semèn"
    },
    'zh': {
      "Twice Daily": "半天",
      "Daily": "天",
      "Twice Weekly": "半周",
      "Weekly": "周"
    },
    'sw': {
      "Twice Daily": "nusu siku",
      "Daily": "siku",
      "Twice Weekly": "nusu wiki",
      "Weekly": "wiki"
    },
    'ar': {
      "Twice Daily": "نصف يوم",
      "Daily": "أيام",
      "Twice Weekly": "نصف أسبوع",
      "Weekly": "أسابيع"
    }
  };

  const stepTextTemplates: Record<Language['lang'], string> = {
    'en-US': `${index === 0 ? 'Take' : `Then take`} ${step.dose}mg ${stepTypeText[lang][stepType]} for ${step.duration} ${step.duration === 1 ? durationUnit[lang][stepType].slice(0, -1) : durationUnit[lang][stepType]} (${formattedDateRange})`,
    'es': `${index === 0 ? 'Tomar' : `Después tome`} ${step.dose}mg ${stepTypeText[lang][stepType]} durante ${step.duration} ${step.duration === 1 ? durationUnit[lang][stepType].slice(0, -1) : durationUnit[lang][stepType]} (${formattedDateRange})`,
    'ht': `${index === 0 ? 'Pran' : `Apre sa pran`} ${step.dose}mg ${stepTypeText[lang][stepType]} pou ${step.duration} ${step.duration === 1 ? durationUnit[lang][stepType].slice(0, -1) : durationUnit[lang][stepType]} (${formattedDateRange})`,
    'zh': `${index === 0 ? '服用' : `然后服用`} ${step.dose}毫克，${stepTypeText[lang][stepType]}服用${step.duration} ${step.duration === 1 ? durationUnit[lang][stepType].slice(0, -1) : durationUnit[lang][stepType]} (${formattedDateRange})`,
    'sw': `${index === 0 ? 'Kutoka' : `Sasa kutoka`} ${step.dose}mg ${stepTypeText[lang][stepType]} kwa ${step.duration} ${step.duration === 1 ? durationUnit[lang][stepType].slice(0, -1) : durationUnit[lang][stepType]} (${formattedDateRange})`,
    'ar': `${index === 0 ? 'خذ' : `ثم خذ`} ${step.dose}mg ${stepTypeText[lang][stepType]} لمدة ${step.duration} ${step.duration === 1 ? durationUnit[lang][stepType].slice(0, -1) : durationUnit[lang][stepType]} (${formattedDateRange})`
  };

  return stepTextTemplates[selectedLanguage.lang] || '';
};



type FormatPeriodTextParams = {
  step: Step;
  stepStartDate: ScheduleDate;
  outputPeriodSize: OutputPeriodSize;
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
  outputPeriodSize,
  index,
  selectedLanguage
}: FormatPeriodTextParams): string => {
  const { lang, dir } = selectedLanguage;

  const formattedStartDate = cachedFormatDate(stepStartDate, lang);

  let periodDescription = '';
  let doseDescription = '';

  switch (outputPeriodSize) {
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
      throw new Error(`Unsupported period type: ${outputPeriodSize}`);
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
