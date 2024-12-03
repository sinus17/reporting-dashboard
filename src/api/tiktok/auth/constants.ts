export const AUTH_ENDPOINTS = {
  TOKEN_EXCHANGE: '/api/tiktok-exchange',
  TOKEN_REFRESH: '/api/tiktok-refresh',
  AUTH_URL: 'https://business-api.tiktok.com/portal/auth',
  API_BASE: 'https://business-api.tiktok.com/open_api/v1.3'
};

export const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const AUTH_TIMEOUT = 15000; // 15 seconds

export const AUTH_SCOPES = [
  'user.info',
  'ad.read',
  'ad.write'
];

export const ERROR_MESSAGES = {
  INVALID_RESPONSE: 'Invalid response from TikTok API',
  MISSING_CREDENTIALS: 'Missing required credentials',
  INVALID_AUTH_CODE: 'Invalid authorization code',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  NETWORK_ERROR: 'Network error during authentication',
  TOKEN_EXPIRED: 'Authentication token has expired'
};