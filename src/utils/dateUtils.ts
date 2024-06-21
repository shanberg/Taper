export const isDateThisYear = (date: ScheduleDate): boolean => {
  return date.getFullYear() === new Date().getFullYear();
};

/** Higher-order function to create a cached formatter */
function createCachedFormatter() {
  const dateTimeFormatCache = new Map();

  return function (date: ScheduleDate, lang: string = 'en-US'): LocaleDate {
    const yearFormat = isDateThisYear(date) ? undefined : 'numeric';
    const cacheKey = `${lang}-${yearFormat}`;

    // Check if the formatter is already in the cache
    if (!dateTimeFormatCache.has(cacheKey)) {
      // Create a new formatter and store it in the cache
      const formatter = new Intl.DateTimeFormat(lang, {
        month: 'short',
        day: 'numeric',
        year: yearFormat
      });
      dateTimeFormatCache.set(cacheKey, formatter);
    }

    // Use the cached formatter
    const formatter = dateTimeFormatCache.get(cacheKey);
    return formatter.format(date) as LocaleDate;
  };
}

// Create a cached version of formatDate
export const cachedFormatDate = createCachedFormatter();