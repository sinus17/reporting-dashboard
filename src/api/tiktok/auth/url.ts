import { generateAuthState } from './state';
import { AUTH_ENDPOINTS, AUTH_SCOPES } from './constants';
import { TikTokCredentials } from '../../../types/tiktok';
import { AuthError } from './errors';

export const getTikTokAuthUrl = (appId: string, redirectUri: string): string => {
  if (!appId || !redirectUri) {
    throw new AuthError('Missing required credentials for auth URL', {
      timestamp: new Date().toISOString(),
      missing: {
        appId: !appId,
        redirectUri: !redirectUri
      }
    });
  }

  const state = generateAuthState();
  const params = new URLSearchParams({
    app_id: appId,
    redirect_uri: redirectUri,
    state,
    scope: AUTH_SCOPES.join(','),
    response_type: 'code'
  });

  return `${AUTH_ENDPOINTS.AUTH_URL}?${params.toString()}`;
};