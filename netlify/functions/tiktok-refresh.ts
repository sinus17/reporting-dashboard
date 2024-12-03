import { Handler } from '@netlify/functions';
import axios from 'axios';
import { corsHeaders, handleCors } from './config/cors';
import { createResponse, createErrorResponse } from './config/responses';
import { formatValidISO } from '../../src/utils/date';

const TIKTOK_API_BASE = 'https://business-api.tiktok.com/open_api/v1.3';

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCors();
  }

  if (event.httpMethod !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  try {
    const { refreshToken, appId, clientSecret } = JSON.parse(event.body || '{}');

    if (!refreshToken || !appId || !clientSecret) {
      return createErrorResponse('Missing required parameters', 400);
    }

    console.log('Processing token refresh:', {
      appId,
      timestamp: formatValidISO(new Date())
    });

    const response = await axios.post(
      `${TIKTOK_API_BASE}/oauth2/refresh_token/`,
      {
        app_id: appId,
        secret: clientSecret,
        refresh_token: refreshToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('Token refresh response received:', {
      status: response.status,
      hasData: !!response.data,
      timestamp: formatValidISO(new Date())
    });

    return createResponse(response.data);
  } catch (error) {
    console.error('Token refresh error:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error,
      timestamp: formatValidISO(new Date())
    });

    if (axios.isAxiosError(error)) {
      return createErrorResponse(
        error.response?.data?.message || 'Failed to refresh token',
        error.response?.status || 500,
        error.response?.data
      );
    }

    return createErrorResponse(
      'Internal server error',
      500,
      error instanceof Error ? { message: error.message } : error
    );
  }
};

export { handler };