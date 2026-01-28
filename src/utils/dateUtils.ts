/**
 * @fileoverview Date formatting: year check, cached Intl formatter, and locale date strings.
 */
import { TaperDate } from '../TaperDate';

/** Returns true if the given date is in the current calendar year. */
export const isDateThisYear = (date: ScheduleDate): boolean => {
  return date.getFullYear() === new Date().getFullYear();
};

type FormatDateOptions = {
  /** Omit year (month + day only). Use for compact ranges e.g. segment text. */
  short?: boolean;
};

/**
 * Returns a cache key for the Intl formatter given lang and format options.
 * @param lang - Locale code (e.g. 'en-US')
 * @param short - If true, omit year (month+day only)
 * @param includeYear - If true, include full year in output
 * @returns Cache key string used for formatter lookup
 */
function getFormatterCacheKey(lang: string, short: boolean, includeYear: boolean): string {
  const formatKind = short ? 'short' : includeYear ? 'numeric' : 'omit';
  return `${lang}-${formatKind}`;
}

/**
 * Higher-order function that returns a cached formatter for ScheduleDate -> LocaleDate.
 * @returns A function (date, lang?, options?) that formats a date using a cached Intl.DateTimeFormat
 */
function createCachedFormatter(): (
  date: ScheduleDate,
  lang?: string,
  options?: FormatDateOptions
) => LocaleDate {
  const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>();

  /**
   * Formats a schedule date using a cached Intl formatter.
   * @param date - Schedule date to format
   * @param lang - Locale code (default 'en-US')
   * @param options - Optional { short: true } to omit year
   * @returns Formatted locale date string
   */
  function formatDateCached(
    date: ScheduleDate,
    lang: string = 'en-US',
    options?: FormatDateOptions
  ): LocaleDate {
    const short = options?.short === true;
    const includeYear = !short && !isDateThisYear(date);
    const cacheKey = getFormatterCacheKey(lang, short, includeYear);

    let formatter = dateTimeFormatCache.get(cacheKey);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat(lang, {
        month: 'short',
        day: 'numeric',
        year: includeYear ? 'numeric' : undefined
      });
      dateTimeFormatCache.set(cacheKey, formatter);
    }

    return formatter.format(date) as LocaleDate;
  }

  return formatDateCached;
}

/** Cached formatter for ScheduleDate -> LocaleDate (month/day/year per options). */
export const cachedFormatDate = createCachedFormatter();
