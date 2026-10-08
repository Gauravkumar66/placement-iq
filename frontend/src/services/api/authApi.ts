import { apiClient } from './client';
import { TokenResponse, User } from '../../types/auth';
import { APIResponse } from '../../types/api';

export const authApi = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const res = await apiClient.post<APIResponse<TokenResponse>>('/auth/login', {
      email,
      password,
    });
    return res.data.data;
  },

  register: async (data: {
    email: string;
    password: string;
    role: string;
    full_name?: string;
  }): Promise<TokenResponse> => {
    const res = await apiClient.post<APIResponse<TokenResponse>>('/auth/register', data);
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<APIResponse<User>>('/auth/me');
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
};
