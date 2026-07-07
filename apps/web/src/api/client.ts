import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('devtrack.accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authStore = useAuthStore();
        await authStore.refreshSession();
        originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        const authStore = useAuthStore();
        authStore.clearSession();
      }
    }

    return Promise.reject(error);
  },
);
