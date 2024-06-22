import { cachedFormatDate } from './dateUtils';

type FormatSegmentTextParams = SegmentWithStartEndDate & {
  index: number;
  selectedLanguage: Language;
};

/** Format segment content based on selected language */
export const formatSegmentText = ({
  segment,
  segmentStartDate,
  segmentEndDate,
  index,
  selectedLanguage
}: FormatSegmentTextParams): string => {
  const { lang, dir } = selectedLanguage;

  const dates = {
    start: cachedFormatDate(segmentStartDate, lang),
    end: cachedFormatDate(segmentEndDate, lang)
  };
  const formattedDateRange =
    dir === 'ltr' ? `${dates.start} - ${dates.end}` : `${dates.end} - ${dates.start}`;

  if (selectedLanguage.labelEn === 'English') {
    // English
    return `${index === 0 ? 'Take' : `Then take`} ${segment.dose}mg daily for ${segment.daysForDose} ${segment.daysForDose === 1 ? 'day' : 'days'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Spanish') {
    // Spanish
    return `${index === 0 ? 'Tomar' : `Después tome`} ${segment.dose}mg cada día durante ${segment.daysForDose} ${segment.daysForDose === 1 ? 'día' : 'días'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Haitian Creole') {
    // Haitian Creole
    return `${index === 0 ? 'Pran' : `Apre sa pran`} ${segment.dose}mg chak jou pou ${segment.daysForDose} ${segment.daysForDose === 1 ? 'jou' : 'jou'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Mandarin') {
    // Mandarin
    return `${index === 0 ? '服用' : `然后服用`} ${segment.dose}毫克，每天服用${segment.daysForDose} ${segment.daysForDose === 1 ? '天' : '天'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Swahili') {
    // Swahili
    return `${index === 0 ? 'Kutoka' : `Sasa kutoka`} ${segment.dose}mg kwa saa ${segment.daysForDose} ${segment.daysForDose === 1 ? 'siku' : 'siku'} (${formattedDateRange})`;
  } else if (selectedLanguage.labelEn === 'Arabic') {
    // Arabic
    return `${index === 0 ? 'احتياج' : `في ذلك الحين تحتاج`} ${segment.dose}mg كل يوم ${segment.daysForDose} ${segment.daysForDose === 1 ? 'يوم' : 'يوم'} (${formattedDateRange})`;
  }

  return '';
};
