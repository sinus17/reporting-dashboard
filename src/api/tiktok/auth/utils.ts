import { AxiosResponse } from 'axios';
import { encryptData } from '../../../utils/encryption';
import { TikTokCredentials, TikTokTokens } from '../../../types/tiktok';
import { formatValidISO, addSeconds } from '../../../utils/date';
import { AuthError } from './errors';

export const createAuthRequest = (code: string, credentials: TikTokCredentials) => {
  return {
    code,
    appId: credentials.appId,
    clientSecret: credentials.clientSecret
  };
};

export const handleAuthResponse = (response: AxiosResponse): TikTokTokens => {
  if (!response.data?.data?.access_token) {
    throw new AuthError('Invalid response from TikTok API', {
      timestamp: formatValidISO(new Date()),
      response: response.data
    });
  }

  const { access_token, refresh_token, expires_in } = response.data.data;
  const expiryDate = addSeconds(new Date(), expires_in);

  return {
    accessToken: encryptData(access_token),
    refreshToken: encryptData(refresh_token),
    tokenExpiry: formatValidISO(expiryDate)
  };
};

export const validateTokenResponse = (data: any) => {
  if (!data?.access_token || !data?.refresh_token || !data?.expires_in) {
    throw new AuthError('Invalid token response format', {
      timestamp: formatValidISO(new Date()),
      response: data
    });
  }
  return data;
};