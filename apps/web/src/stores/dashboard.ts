import { defineStore } from 'pinia';
import { dashboardApi, type DashboardStats } from '@/api/dashboard';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null as DashboardStats | null,
    loading: false,
  }),
  actions: {
    async fetchStats() {
      this.loading = true;
      try {
        this.stats = await dashboardApi.getStats();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});
