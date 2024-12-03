const API_BASE = '/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
    timestamp: string;
  };
  timestamp: string;
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

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

export const api = {
  hello: () => fetchApi<{ 
    message: string; 
    timestamp: string;
    path: string;
    headers: Record<string, string>;
  }>('hello'),

  tiktokAuth: (code: string, credentials: any) => 
    fetchApi('tiktok-auth', {
      method: 'POST',
      body: { code, ...credentials }
    }),
    
  tiktokExchange: (params: any) =>
    fetchApi('tiktok-exchange', {
      method: 'POST',
      body: params
    })
};