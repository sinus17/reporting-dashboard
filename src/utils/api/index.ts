import { fetchApi } from './client';

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

export * from './error';
export * from './types';