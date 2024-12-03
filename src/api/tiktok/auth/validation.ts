import { TikTokCredentials } from '../../../types/tiktok';
import { AuthError } from './errors';

export const validateCredentials = (credentials: Partial<TikTokCredentials>): void => {
  const { appId, clientSecret, redirectUri } = credentials;
  const missing: Record<string, boolean> = {};

  if (!appId) missing.appId = true;
  if (!clientSecret) missing.clientSecret = true;
  if (!redirectUri) missing.redirectUri = true;

  if (Object.keys(missing).length > 0) {
    throw new AuthError('Missing required credentials', {
      timestamp: new Date().toISOString(),
      missing
    });
  }
};

export const validateAuthCode = (code: string): void => {
  if (!code || typeof code !== 'string' || code.length < 10) {
    throw new AuthError('Invalid authorization code', {
      timestamp: new Date().toISOString(),
      code: code ? `${code.substring(0, 10)}...` : 'undefined'
    });
  }
};

export const validateRefreshToken = (token: string): void => {
  if (!token || typeof token !== 'string') {
    throw new AuthError('Invalid refresh token', {
      timestamp: new Date().toISOString()
    });
  }
};

export const validateTokenResponse = (data: any): void => {
  if (!data?.access_token || !data?.refresh_token || !data?.expires_in) {
    throw new AuthError('Invalid token response format', {
      timestamp: new Date().toISOString(),
      response: data
    });
  }
};