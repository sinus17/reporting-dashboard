import { formatISO, parseISO, addSeconds as dateFnsAddSeconds } from 'date-fns';

export const createValidDate = (date: Date | string | number): Date => {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  }
  if (typeof date === 'string') {
    const parsed = parseISO(date);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  if (typeof date === 'number' && !isNaN(date)) {
    const fromTimestamp = new Date(date);
    if (!isNaN(fromTimestamp.getTime())) {
      return fromTimestamp;
    }
  }
  return new Date();
};

export const formatValidISO = (date: Date | string | number): string => {
  try {
    const validDate = createValidDate(date);
    return validDate.toISOString();
  } catch (error) {
    console.error('Invalid date format:', error);
    return new Date().toISOString();
  }
};

export const addSeconds = (date: Date | string | number, seconds: number): Date => {
  try {
    const validDate = createValidDate(date);
    const newDate = new Date(validDate.getTime() + seconds * 1000);
    return newDate;
  } catch (error) {
    console.error('Error adding seconds:', error);
    return new Date();
  }
};

export const isValidDate = (date: any): boolean => {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  if (typeof date === 'string') {
    const parsed = parseISO(date);
    return !isNaN(parsed.getTime());
  }
  if (typeof date === 'number') {
    return !isNaN(new Date(date).getTime());
  }
  return false;
};