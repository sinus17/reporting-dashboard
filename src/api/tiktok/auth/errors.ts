export interface AuthErrorDetails {
  timestamp: string;
  code?: string;
  response?: any;
  originalError?: any;
  missing?: Record<string, boolean>;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public details: AuthErrorDetails
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const createAuthError = (message: string, details: Partial<AuthErrorDetails> = {}): AuthError => {
  return new AuthError(message, {
    timestamp: new Date().toISOString(),
    ...details
  });
};

export const formatErrorMessage = (error: AuthError): string => {
  if (error.details.missing) {
    const missing = Object.keys(error.details.missing).join(', ');
    return `Missing required fields: ${missing}`;
  }
  return error.message;
};