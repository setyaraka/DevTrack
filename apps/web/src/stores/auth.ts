import { defineStore } from 'pinia';
import { authApi } from '@/api/auth';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const ACCESS_TOKEN_KEY = 'devtrack.accessToken';
const REFRESH_TOKEN_KEY = 'devtrack.refreshToken';
const USER_KEY = 'devtrack.user';

function readUser() {
  const rawUser = localStorage.getItem(USER_KEY);
  return rawUser ? (JSON.parse(rawUser) as User) : null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: readUser(),
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken && state.user),
  },
  actions: {
    setSession(session: AuthResponse) {
      this.user = session.user;
      this.accessToken = session.accessToken;
      this.refreshToken = session.refreshToken;
      localStorage.setItem(USER_KEY, JSON.stringify(session.user));
      localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    },
    clearSession() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
    async login(payload: LoginPayload) {
      const session = await authApi.login(payload);
      this.setSession(session);
    },
    async register(payload: RegisterPayload) {
      const session = await authApi.register(payload);
      this.setSession(session);
    },
    async refreshSession() {
      if (!this.refreshToken) {
        throw new Error('Missing refresh token');
      }

      const session = await authApi.refresh(this.refreshToken);
      this.setSession(session);
    },
    async logout() {
      if (this.refreshToken) {
        await authApi.logout(this.refreshToken);
      }

      this.clearSession();
    },
  },
});
