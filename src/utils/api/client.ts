import { ApiError } from './error';
import { ApiOptions, ApiResponse } from './types';

const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  try {
    const url = `${API_BASE}/${endpoint}`;
    console.log(`API Request: ${method} ${url}`);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data: ApiResponse<T> = await response.json();
    console.log(`API Response: ${response.status}`, data);

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.error?.message || 'An error occurred',
        response.status,
        data.error?.details
      );
    }

    return data.data as T;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      500
    );
  }
}

export { fetchApi };