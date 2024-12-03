import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { formatValidISO } from './date';

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  timestamp: string;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const createHttpClient = (baseURL: string, config: AxiosRequestConfig = {}) => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    },
    ...config
  });

  client.interceptors.response.use(
    (response: AxiosResponse): HttpResponse => ({
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
      timestamp: formatValidISO(new Date())
    }),
    (error) => {
      if (axios.isAxiosError(error)) {
        throw new HttpError(
          error.response?.data?.message || error.message,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw error;
    }
  );

  return client;
};