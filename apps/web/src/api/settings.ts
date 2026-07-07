import { apiClient } from './client';

export interface UserSettings {
  profile: {
    avatarUrl: string;
    name: string;
    email: string;
    company: string;
    jobTitle: string;
    timezone: string;
  };
  appearance: {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    sidebarMode: 'EXPANDED' | 'COLLAPSED';
  };
  workPreferences: {
    workingDays: string[];
    autoTaskRollover: boolean;
    rolloverTime: string;
  };
}

export const settingsApi = {
  getSettings() {
    return apiClient.get<UserSettings>('/settings').then((res) => res.data);
  },
  updateProfile(data: UserSettings['profile']) {
    return apiClient.patch<UserSettings>('/settings/profile', data).then((res) => res.data);
  },
  updateAppearance(data: UserSettings['appearance']) {
    return apiClient.patch<UserSettings>('/settings/appearance', data).then((res) => res.data);
  },
  updateWorkPreferences(data: UserSettings['workPreferences']) {
    return apiClient.patch<UserSettings>('/settings/work-preferences', data).then((res) => res.data);
  },
  updatePassword(data: any) {
    return apiClient.patch('/settings/password', data).then((res) => res.data);
  },
};
