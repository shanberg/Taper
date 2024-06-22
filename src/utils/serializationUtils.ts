import { TaperDate } from '../TaperDate';

export const serializeSchedule = (schedule: Schedule): SerializedSchedule => {
  return JSON.stringify(schedule, (key, value) => {
    if (key === 'startDate' || key === 'endDate' || key === 'startDateInputValue') {
      return { __brand: 'Date', value: new TaperDate(value).toYYYYMMDD() };
    }
    return value;
  }) as SerializedSchedule;
};

export const deserializeSchedule = (serializedSchedule: SerializedSchedule): Schedule => {
  return JSON.parse(serializedSchedule, (key, value) => {
    if (value && value.__brand === 'Date') {
      return new TaperDate(value.value).toScheduleDate();
    }
    return value;
  }) as Schedule;
};