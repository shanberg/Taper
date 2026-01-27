import { TaperDate } from '../TaperDate';

export const isDateThisYear = (date: ScheduleDate): boolean => {
  return date.getFullYear() === new Date().getFullYear();
};

type FormatDateOptions = {
  /** Omit year (month + day only). Use for compact ranges e.g. segment text. */
  short?: boolean;
};

/** Higher-order function to create a cached formatter */
function createCachedFormatter() {
  const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();

  return function (
    date: ScheduleDate,
    lang: string = 'en-US',
    options?: FormatDateOptions
  ): LocaleDate {
    const yearFormat =
      options?.short === true ? undefined : isDateThisYear(date) ? undefined : 'numeric';
    const cacheKey = `${lang}-${options?.short ? 'short' : String(yearFormat ?? 'omit')}`;

    if (!dateTimeFormatCache.has(cacheKey)) {
      const formatter = new Intl.DateTimeFormat(lang, {
        month: 'short',
        day: 'numeric',
        year: yearFormat
      });
      dateTimeFormatCache.set(cacheKey, formatter);
    }

    const formatter = dateTimeFormatCache.get(cacheKey)!;
    return formatter.format(date) as LocaleDate;
  };
}

// Create a cached version of formatDate
export const cachedFormatDate = createCachedFormatter();
