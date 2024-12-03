import { formatValidISO } from '../date';

export interface ConnectionErrorDetails {
  timestamp: string;
  platform: string;
  code?: string;
  subcode?: string;
  originalError?: any;
}

export class ConnectionError extends Error {
  constructor(
    message: string,
    public details: ConnectionErrorDetails
  ) {
    super(message);
    this.name = 'ConnectionError';
  }
}

export const createConnectionError = (
  platform: string,
  message: string,
  details: Partial<ConnectionErrorDetails> = {}
): ConnectionError => {
  return new ConnectionError(message, {
    platform,
    timestamp: formatValidISO(new Date()),
    ...details
  });
};

export const logConnectionError = (error: ConnectionError): void => {
  console.error(`[${error.details.platform}] Connection error:`, {
    message: error.message,
    details: error.details,
    timestamp: formatValidISO(new Date())
  });
};