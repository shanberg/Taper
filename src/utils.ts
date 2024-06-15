const isDateThisYear = (date: Date) => {
  return date.getFullYear() === new Date().getFullYear();
}

export function formatDate(dateStr: string, style = 'conciseUS') {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('default', { month: 'short', day: 'numeric', year: isDateThisYear(date) ? undefined : 'numeric' }).format(new Date(date));
}

export const isRowValid = (row: { dose: number, daysForDose: number }): boolean => {
  return row.dose <= 0 || row.daysForDose <= 0
}

export const isRowPlaceholder = (row: { dose: number, daysForDose: number }): boolean => {
  return row.dose === 0 && row.daysForDose === 0
}

// Helper function to format dates as 'YYYY-MM-DD'
export function yyyymmdd(date: Date): string {
  const d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

export const formatRowText = (row: { dose: number, daysForDose: number }, rowStartDate: Date, rowEndDate: Date, index: number, selectedLanguageKey: string) => {
  const formattedDateRange = formatDate(yyyymmdd(rowStartDate)) + ' - ' + formatDate(yyyymmdd(rowEndDate));

  if (selectedLanguageKey === 'English') {
    return `${index === 0 ? "Take" : `Then take`} ${row.dose}mg daily for ${row.daysForDose} ${row.daysForDose === 1 ? 'day' : 'days'} (${formattedDateRange})`;
  } else if (selectedLanguageKey === 'Spanish') {
    return `${index === 0 ? "Tomar" : `Después tome`} ${row.dose}mg cada día durante ${row.daysForDose} ${row.daysForDose === 1 ? 'día' : 'días'} (${formattedDateRange})`;
  } else if (selectedLanguageKey === 'Haitian Creole') {
    return `${index === 0 ? "Pran" : `Apre sa pran`} ${row.dose}mg chak jou pou ${row.daysForDose} ${row.daysForDose === 1 ? 'jou' : 'jou'} (${formattedDateRange})`;
  } else if (selectedLanguageKey === 'Mandarin') {
    return `${index === 0 ? "服用" : `然后服用`} ${row.dose}毫克，每天服用${row.daysForDose} ${row.daysForDose === 1 ? '天' : '天'} (${formattedDateRange})`;
  }
  return "";
};