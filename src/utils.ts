export function formatDate(date, style = 'conciseUS') {
let options;

  switch (style) {
    case 'conciseUS':
      options = { month: 'numeric', day: 'numeric' };
      break;
    case 'conciseEU':
      options = { day: 'numeric', month: 'numeric', year: '2-digit' };
      break;
    case 'longform':
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      break;
    // Add more styles as needed
    default:
      options = {};
  }

  return new Intl.DateTimeFormat('default', options).format(new Date(date));
}

export const isRowValid = (row): boolean => {
  return row.dose <= 0 || row.daysForDose <= 0
}

export const isRowPlaceholder = (row): boolean => {
  return row.dose === 0 && row.daysForDose === 0
}