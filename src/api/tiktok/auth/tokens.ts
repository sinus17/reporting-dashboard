import axios from 'axios';
import { TikTokCredentials, TikTokTokens } from '../../../types/tiktok';
import { validateCredentials, validateAuthCode, validateRefreshToken } from './validation';
import { createAuthError } from './errors';
import { AUTH_ENDPOINTS, AUTH_HEADERS, AUTH_TIMEOUT } from './constants';
import { exchangeAuthCode } from './exchange';

export const exchangeToken = async (params: {
  code: string;
  appId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<TikTokTokens> => {
  try {
    validateAuthCode(params.code);
    validateCredentials({
      appId: params.appId,
      clientSecret: params.clientSecret,
      redirectUri: params.redirectUri
    });

    return await exchangeAuthCode(params);
  } catch (error) {
    console.error('Token exchange error:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error,
      timestamp: new Date().toISOString()
    });

    if (axios.isAxiosError(error)) {
      throw createAuthError(
        error.response?.data?.message || 'Token exchange failed',
        {
          response: error.response?.data
        }
      );
    }

    throw createAuthError('Token exchange failed', {
      originalError: error
    });
  }
};

export const refreshToken = async (refreshToken: string, credentials: TikTokCredentials): Promise<TikTokTokens> => {
  try {
    validateRefreshToken(refreshToken);
    validateCredentials(credentials);

    const response = await axios.post(
      AUTH_ENDPOINTS.TOKEN_REFRESH,
      {
        refreshToken,
        appId: credentials.appId,
        clientSecret: credentials.clientSecret
      },
      {
        headers: AUTH_HEADERS,
        timeout: AUTH_TIMEOUT
      }
    );

    if (!response.data?.data?.access_token) {
      throw createAuthError('Invalid response from TikTok API', {
        response: response.data
      });
    }

    const { access_token, refresh_token, expires_in } = response.data.data;
    const expiryDate = new Date(Date.now() + (expires_in || 7200) * 1000);

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiry: expiryDate.toISOString()
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw createAuthError(
        error.response?.data?.message || 'Token refresh failed',
        {
          response: error.response?.data
        }
      );
    }

    throw createAuthError('Token refresh failed', {
      originalError: error
    });
  }
};