import { Handler } from '@netlify/functions';
import axios from 'axios';
import { handleCors } from './config/cors';
import { createResponse, createErrorResponse } from './config/responses';

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCors();
  }

  if (event.httpMethod !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  try {
    const { code, appId, clientSecret } = JSON.parse(event.body || '{}');
    const timestamp = new Date().toISOString();

    if (!code || !appId || !clientSecret) {
      console.error('Missing required parameters:', {
        hasCode: !!code,
        hasAppId: !!appId,
        hasClientSecret: !!clientSecret,
        timestamp
      });
      return createErrorResponse('Missing required parameters', 400);
    }

    console.log('Processing TikTok token exchange:', {
      appId,
      codePrefix: code.substring(0, 10) + '...',
      timestamp
    });

    const response = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
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
        timeout: 15000
      }
    );

    const data = response.data?.data;
    console.log(data);
    if (!data?.access_token) {
      console.error('Invalid TikTok API response:', {
        status: response.status,
        data: response.data,
        timestamp: new Date().toISOString()
      });
      return createErrorResponse('Invalid response from TikTok API', 500);
    }

    // Calculate expiry date
    const expiryDate = new Date(Date.now() + (data.expires_in || 7200) * 1000);
    const enrichedData = {
      ...response.data,
      data: {
        ...data,
        expiry_date: expiryDate.toISOString()
      }
    };

    console.log('TikTok API response received:', {
      status: response.status,
      hasAccessToken: true,
      expiryDate: expiryDate.toISOString(),
      timestamp: new Date().toISOString()
    });

    return createResponse(enrichedData);
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error('Token exchange error:', {
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error,
      timestamp
    });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to exchange token';
      
      return createErrorResponse(message, status, {
        details: error.response?.data,
        timestamp
      });
    }

    return createErrorResponse(
      'Internal server error',
      500,
      {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      }
    );
  }
};

export { handler };