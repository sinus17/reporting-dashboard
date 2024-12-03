import { TimestampError } from './timestamp';

export const createUnixTimestamp = (): number => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    console.log('[UnixTimestamp] Created Unix timestamp:', {
      timestamp,
      currentTime: new Date().toISOString()
    });
    return timestamp;
  } catch (error) {
    throw new TimestampError('Failed to create Unix timestamp', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const validateUnixTimestamp = (timestamp: any): number => {
  console.log('[UnixTimestamp] Validating Unix timestamp:', {
    input: timestamp,
    type: typeof timestamp
  });

  if (typeof timestamp !== 'number' || isNaN(timestamp)) {
    throw new TimestampError('Invalid Unix timestamp format', timestamp);
  }

  // Basic validation: timestamp should be a reasonable value
  const now = Math.floor(Date.now() / 1000);
  const oneYearAgo = now - (365 * 24 * 60 * 60);
  const oneYearFuture = now + (365 * 24 * 60 * 60);

  if (timestamp < oneYearAgo || timestamp > oneYearFuture) {
    throw new TimestampError('Unix timestamp out of reasonable range', {
      timestamp,
      now,
      range: { min: oneYearAgo, max: oneYearFuture }
    });
  }

  return timestamp;
};

export const createUnixExpiryDate = (expiresIn: number = 7200): number => {
  if (typeof expiresIn !== 'number' || isNaN(expiresIn)) {
    throw new TimestampError('Invalid expiresIn value for Unix timestamp', expiresIn);
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + expiresIn;

    console.log('[UnixTimestamp] Created Unix expiry timestamp:', {
      now,
      expiresIn,
      expiry
    });

    return expiry;
  } catch (error) {
    throw new TimestampError('Failed to create Unix expiry timestamp', {
      expiresIn,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const isUnixTimestampExpired = (timestamp: number): boolean => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const isExpired = timestamp <= now;

    console.log('[UnixTimestamp] Checking Unix timestamp expiry:', {
      timestamp,
      now,
      isExpired,
      timeDifference: now - timestamp
    });

    return isExpired;
  } catch (error) {
    throw new TimestampError('Failed to check Unix timestamp expiry', {
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const convertToUnixTimestamp = (date: Date | string): number => {
  try {
    const timestamp = typeof date === 'string' ? new Date(date).getTime() : date.getTime();
    const unixTimestamp = Math.floor(timestamp / 1000);

    console.log('[UnixTimestamp] Converted to Unix timestamp:', {
      input: date,
      output: unixTimestamp
    });

    return unixTimestamp;
  } catch (error) {
    throw new TimestampError('Failed to convert to Unix timestamp', {
      date,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const convertFromUnixTimestamp = (unixTimestamp: number): Date => {
  try {
    const date = new Date(unixTimestamp * 1000);
    
    if (isNaN(date.getTime())) {
      throw new TimestampError('Invalid Unix timestamp conversion', unixTimestamp);
    }

    console.log('[UnixTimestamp] Converted from Unix timestamp:', {
      input: unixTimestamp,
      output: date.toISOString()
    });

    return date;
  } catch (error) {
    throw new TimestampError('Failed to convert from Unix timestamp', {
      unixTimestamp,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};