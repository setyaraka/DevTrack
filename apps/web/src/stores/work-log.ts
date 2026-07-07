import { defineStore } from 'pinia';
import { workLogApi, type WorkLog } from '@/api/work-log';

export const useWorkLogStore = defineStore('work-log', {
  state: () => ({
    logs: [] as WorkLog[],
    loading: false,
  }),
  actions: {
    async fetchLogs() {
      this.loading = true;
      try {
        this.logs = await workLogApi.getAll();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async createLog(data: Omit<WorkLog, 'id'>) {
      try {
        const created = await workLogApi.create(data);
        this.logs.unshift(created);
      } catch (err) {
        console.error(err);
      }
    },
    async updateLog(id: string, data: Partial<Omit<WorkLog, 'id'>>) {
      try {
        const updated = await workLogApi.update(id, data);
        const index = this.logs.findIndex((l) => l.id === id);
        if (index !== -1) {
          this.logs[index] = updated;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteLog(id: string) {
      try {
        await workLogApi.delete(id);
        this.logs = this.logs.filter((l) => l.id !== id);
      } catch (err) {
        console.error(err);
      }
    },
  },
});
