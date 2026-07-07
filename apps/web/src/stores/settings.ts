import { defineStore } from 'pinia';
import { settingsApi, type UserSettings } from '@/api/settings';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null as UserSettings | null,
    loading: false,
    successMessage: '',
  }),
  actions: {
    async fetchSettings() {
      this.loading = true;
      try {
        this.settings = await settingsApi.getSettings();
        if (this.settings) {
          this.applyTheme(this.settings.appearance.theme);
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async updateProfile(profileData: UserSettings['profile']) {
      this.loading = true;
      try {
        this.settings = await settingsApi.updateProfile(profileData);
        this.triggerSuccess('Profile settings saved successfully!');
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updateAppearance(appearanceData: UserSettings['appearance']) {
      this.loading = true;
      try {
        this.settings = await settingsApi.updateAppearance(appearanceData);
        this.triggerSuccess('Appearance settings saved successfully!');
        this.applyTheme(appearanceData.theme);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updateWorkPreferences(prefData: UserSettings['workPreferences']) {
      this.loading = true;
      try {
        this.settings = await settingsApi.updateWorkPreferences(prefData);
        this.triggerSuccess('Work preferences saved successfully!');
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updatePassword(passwordData: any) {
      this.loading = true;
      try {
        await settingsApi.updatePassword(passwordData);
        this.triggerSuccess('Password updated successfully!');
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    triggerSuccess(msg: string) {
      this.successMessage = msg;
      setTimeout(() => {
        if (this.successMessage === msg) {
          this.successMessage = '';
        }
      }, 3000);
    },
    applyTheme(theme: 'LIGHT' | 'DARK' | 'SYSTEM') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (theme === 'DARK') {
        root.classList.add('dark');
      } else if (theme === 'LIGHT') {
        root.classList.add('light');
      } else {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemDark ? 'dark' : 'light');
      }
    },
  },
});
