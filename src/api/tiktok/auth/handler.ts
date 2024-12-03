import { TikTokCredentials, TikTokTokens } from '../../../types/tiktok';
import { validateAuthCode, validateCredentials } from './validation';
import { exchangeToken } from './tokens';
import { createAuthError } from './errors';
import { ERROR_MESSAGES } from './constants';

export const handleTikTokAuth = async (
  code: string,
  credentials: TikTokCredentials
): Promise<TikTokTokens> => {
  try {
    console.log('Processing TikTok auth:', {
      appId: credentials.appId,
      codePrefix: code.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    });

    validateAuthCode(code);
    validateCredentials(credentials);

    const tokens = await exchangeToken({
      code,
      appId: credentials.appId,
      clientSecret: credentials.clientSecret,
      redirectUri: credentials.redirectUri
    });

    // Store the connection details
    const connections = JSON.parse(localStorage.getItem('adPlatformConnections') || '{}');
    const now = new Date().toISOString();
    
    connections.tiktok = {
      ...connections.tiktok,
      ...tokens,
      appId: credentials.appId,
      status: 'connected',
      verificationStatus: 'verified',
      lastVerified: now,
      lastUpdated: now
    };
    
    localStorage.setItem('adPlatformConnections', JSON.stringify(connections));

    return tokens;
  } catch (error) {
    console.error('TikTok auth error:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error,
      timestamp: new Date().toISOString()
    });

    throw createAuthError(ERROR_MESSAGES.NETWORK_ERROR, {
      originalError: error
    });
  }
};