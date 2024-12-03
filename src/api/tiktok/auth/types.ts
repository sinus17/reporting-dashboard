import { AxiosResponse } from 'axios';

export interface AuthResponse extends AxiosResponse {
  data: {
    data: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
  };
}

export interface AuthRequest {
  code?: string;
  appId: string;
  clientSecret: string;
  refreshToken?: string;
}

export interface AuthState {
  value: string;
  timestamp: number;
}

export interface TokenExchangeResult {
  success: boolean;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    tokenExpiry: string;
  };
  error?: {
    message: string;
    details?: any;
  };
}