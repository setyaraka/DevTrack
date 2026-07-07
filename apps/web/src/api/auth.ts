import { apiClient } from '@/api/client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';

export const authApi = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  async register(payload: RegisterPayload) {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  async refresh(refreshToken: string) {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },
  async logout(refreshToken: string) {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};
