export interface ApiResponse<T = any> {
  statusCode: number;
  body: string;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Cache-Control'?: string;
  };
}

export const createResponse = <T>(data: T, statusCode = 200): ApiResponse<T> => ({
  statusCode,
  body: JSON.stringify({
    success: true,
    data,
    timestamp: new Date().toISOString()
  }),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  }
});

export const createErrorResponse = (
  message: string,
  statusCode = 500,
  details?: any
): ApiResponse => ({
  statusCode,
  body: JSON.stringify({
    success: false,
    error: {
      message,
      details,
      timestamp: new Date().toISOString()
    }
  }),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  }
});