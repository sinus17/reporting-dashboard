import axios from 'axios';
import { TikTokTokens } from '../../../types/tiktok';
import { AUTH_ENDPOINTS, AUTH_HEADERS, AUTH_TIMEOUT, ERROR_MESSAGES } from './constants';
import { createAuthError } from './errors';
import { createTimestamp, createExpiryDate, validateTimestamp } from '../../../utils/timestamp';

interface ExchangeParams {
  code: string;
  appId: string;
  clientSecret: string;
  redirectUri: string;
}

export const exchangeAuthCode = async (params: ExchangeParams): Promise<TikTokTokens> => {
  try {
    const timestamp = createTimestamp();
    console.log('[TikTok Auth] Starting token exchange:', {
      appId: params.appId,
      codePrefix: params.code.substring(0, 10) + '...',
      timestamp
    });

    const response = await axios.post(
      `${AUTH_ENDPOINTS.API_BASE}/oauth2/access_token/`,
      {
        app_id: params.appId,
        secret: params.clientSecret,
        auth_code: params.code,
        grant_type: 'authorization_code'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: AUTH_TIMEOUT
      }
    );

    console.log('[TikTok Auth] API Response received:', {
      status: response.status,
      hasData: !!response.data,
      hasAccessToken: !!response.data?.data?.access_token,
      timestamp: createTimestamp()
    });

    if (!response.data?.data?.access_token) {
      throw createAuthError(ERROR_MESSAGES.INVALID_RESPONSE, {
        response: response.data,
        timestamp: createTimestamp()
      });
    }

    const { access_token, refresh_token, expires_in } = response.data.data;
    
    // Log timestamp creation
    console.log('[TikTok Auth] Creating expiry date:', {
      expiresIn: expires_in,
      currentTime: new Date().toISOString(),
      timestamp: createTimestamp()
    });
    
    const tokenExpiry = createExpiryDate(expires_in);
    
    // Validate timestamp before returning
    const validatedExpiry = validateTimestamp(tokenExpiry);
    
    console.log('[TikTok Auth] Token exchange successful:', {
      hasAccessToken: true,
      expiryDate: validatedExpiry,
      timestamp: createTimestamp()
    });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiry: validatedExpiry
    };
  } catch (error) {
    console.error('[TikTok Auth] Token exchange error:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error,
      timestamp: createTimestamp()
    });

    if (axios.isAxiosError(error)) {
      throw createAuthError(
        error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
        {
          response: error.response?.data,
          timestamp: createTimestamp()
        }
      );
    }

    throw createAuthError(ERROR_MESSAGES.NETWORK_ERROR, {
      originalError: error,
      timestamp: createTimestamp()
    });
  }
};