import { formatValidISO } from '../date';

export class MetaConnectionError extends Error {
  constructor(
    message: string,
    public details: {
      code?: string;
      subcode?: string;
      timestamp: string;
      originalError?: any;
    }
  ) {
    super(message);
    this.name = 'MetaConnectionError';
  }
}

export const createMetaError = (message: string, details: any = {}): MetaConnectionError => {
  return new MetaConnectionError(message, {
    ...details,
    timestamp: formatValidISO(new Date())
  });
};

export const handleMetaError = (error: any): MetaConnectionError => {
  console.error('[Meta] Connection error:', {
    error: error instanceof Error ? {
      message: error.message,
      name: error.name,
      stack: error.stack
    } : error,
    timestamp: formatValidISO(new Date())
  });

  if (error?.response?.data?.error) {
    const { message, code, error_subcode } = error.response.data.error;
    return createMetaError(message || 'Meta API Error', {
      code,
      subcode: error_subcode,
      originalError: error.response.data
    });
  }

  return createMetaError(
    error instanceof Error ? error.message : 'Unknown Meta connection error',
    { originalError: error }
  );
};