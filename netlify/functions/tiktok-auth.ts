import { Handler } from '@netlify/functions';
import axios from 'axios';
import { handleCors } from './config/cors';
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
    const { code, appId, clientSecret } = JSON.parse(event.body || '{}');

    if (!code || !appId || !clientSecret) {
      console.error('Missing parameters:', {
        hasCode: !!code,
        hasAppId: !!appId,
        hasClientSecret: !!clientSecret,
        timestamp: formatValidISO(new Date())
      });
      return createErrorResponse('Missing required parameters', 400);
    }

    console.log('Processing TikTok auth request:', {
      appId,
      codePrefix: code.substring(0, 10) + '...',
      timestamp: formatValidISO(new Date())
    });

    const response = await axios.post(
      `${TIKTOK_API_BASE}/oauth2/access_token/`,
      {
        app_id: appId,
        secret: clientSecret,
        auth_code: code,
        grant_type: 'authorization_code'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (!response.data?.data?.access_token) {
      console.error('Invalid TikTok API response:', {
        status: response.status,
        data: response.data,
        timestamp: formatValidISO(new Date())
      });
      return createErrorResponse('Invalid response from TikTok API', 500);
    }

    console.log('TikTok API response received:', {
      status: response.status,
      hasAccessToken: !!response.data?.data?.access_token,
      timestamp: formatValidISO(new Date())
    });

    return createResponse(response.data);
  } catch (error) {
    console.error('Token exchange error:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error,
      timestamp: formatValidISO(new Date())
    });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to exchange token';
      
      return createErrorResponse(message, status, {
        details: error.response?.data,
        timestamp: formatValidISO(new Date())
      });
    }

    return createErrorResponse(
      'Internal server error',
      500,
      {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: formatValidISO(new Date())
      }
    );
  }
};

export { handler };