import { Handler } from '@netlify/functions';
import { handleCors } from './config/cors';
import { createResponse, createErrorResponse } from './config/responses';

const handler: Handler = async (event) => {
  // Log incoming request for debugging
  console.log('Received request:', {
    path: event.path,
    httpMethod: event.httpMethod,
    headers: event.headers,
    timestamp: new Date().toISOString()
  });

  if (event.httpMethod === 'OPTIONS') {
    return handleCors();
  }

  if (event.httpMethod !== 'GET') {
    console.log('Method not allowed:', event.httpMethod);
    return createErrorResponse('Method not allowed', 405);
  }

  try {
    const response = {
      message: 'Hello from Netlify Functions!',
      timestamp: new Date().toISOString(),
      path: event.path,
      headers: event.headers
    };

    console.log('Sending response:', response);
    return createResponse(response);
  } catch (error) {
    console.error('Error in hello function:', error);
    return createErrorResponse('Internal server error');
  }
};

export { handler };