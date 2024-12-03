import { isValid, parseISO } from 'date-fns';

export class TimestampError extends Error {
  constructor(message: string, public value?: any) {
    super(message);
    this.name = 'TimestampError';
    console.error('[Timestamp] Error creating timestamp:', {
      message,
      value,
      stack: this.stack,
      timestamp: new Date().toISOString()
    });
  }
}

export const createTimestamp = (): string => {
  try {
    const now = new Date();
    if (!isValid(now)) {
      throw new TimestampError('Invalid system date');
    }
    const timestamp = now.toISOString();
    console.log('[Timestamp] Created timestamp:', timestamp);
    return timestamp;
  } catch (error) {
    if (error instanceof TimestampError) {
      throw error;
    }
    throw new TimestampError('Failed to create timestamp');
  }
};

export const validateTimestamp = (timestamp: any): string => {
  console.log('[Timestamp] Validating timestamp:', {
    input: timestamp,
    type: typeof timestamp,
    currentTime: new Date().toISOString()
  });

  if (!timestamp) {
    throw new TimestampError('Timestamp is required');
  }

  // If it's already a valid ISO string, validate and return it
  if (typeof timestamp === 'string') {
    try {
      const parsed = parseISO(timestamp);
      if (!isValid(parsed)) {
        throw new TimestampError('Invalid ISO string format', timestamp);
      }
      // Ensure we can create a valid ISO string from the parsed date
      const validated = parsed.toISOString();
      console.log('[Timestamp] Validated ISO string:', validated);
      return validated;
    } catch (error) {
      throw new TimestampError('Invalid ISO string format', timestamp);
    }
  }

  // If it's a Date object, validate and convert to ISO string
  if (timestamp instanceof Date) {
    if (!isValid(timestamp)) {
      throw new TimestampError('Invalid Date object', timestamp);
    }
    try {
      const isoString = timestamp.toISOString();
      console.log('[Timestamp] Converted Date to ISO:', isoString);
      return isoString;
    } catch (error) {
      throw new TimestampError('Failed to convert Date to ISO string', timestamp);
    }
  }

  // If it's a number (Unix timestamp), validate and convert to ISO string
  if (typeof timestamp === 'number' && !isNaN(timestamp)) {
    const date = new Date(timestamp);
    if (!isValid(date)) {
      throw new TimestampError('Invalid Unix timestamp', timestamp);
    }
    try {
      const isoString = date.toISOString();
      console.log('[Timestamp] Converted Unix timestamp to ISO:', isoString);
      return isoString;
    } catch (error) {
      throw new TimestampError('Failed to convert Unix timestamp to ISO string', timestamp);
    }
  }

  throw new TimestampError('Unsupported timestamp format', timestamp);
};

export const createExpiryDate = (expiresIn: number = 7200): string => {
  if (typeof expiresIn !== 'number' || isNaN(expiresIn)) {
    throw new TimestampError('Invalid expiresIn value', expiresIn);
  }

  console.log('[Timestamp] Creating expiry date:', {
    expiresIn,
    currentTime: new Date().toISOString()
  });
  
  try {
    const now = Date.now();
    const expiryTime = now + (expiresIn * 1000);
    const date = new Date(expiryTime);
    
    if (!isValid(date)) {
      throw new TimestampError('Invalid expiry date calculation', {
        now,
        expiryTime,
        expiresIn
      });
    }
    
    const expiry = date.toISOString();
    console.log('[Timestamp] Created expiry date:', expiry);
    return expiry;
  } catch (error) {
    if (error instanceof TimestampError) {
      throw error;
    }
    throw new TimestampError('Failed to create expiry date', {
      expiresIn,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const isExpired = (timestamp: string): boolean => {
  try {
    console.log('[Timestamp] Checking expiry:', {
      timestamp,
      currentTime: new Date().toISOString()
    });
    
    const expiryDate = parseISO(timestamp);
    if (!isValid(expiryDate)) {
      throw new TimestampError('Invalid expiry timestamp', timestamp);
    }
    
    const now = Date.now();
    const expiryTime = expiryDate.getTime();
    const isExpired = expiryTime <= now;
    
    console.log('[Timestamp] Expiry check result:', {
      timestamp,
      isExpired,
      currentTime: new Date().toISOString(),
      timeDifference: now - expiryTime
    });
    
    return isExpired;
  } catch (error) {
    if (error instanceof TimestampError) {
      throw error;
    }
    throw new TimestampError('Failed to check expiry', {
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};