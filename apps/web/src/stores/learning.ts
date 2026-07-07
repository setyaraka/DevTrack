import { defineStore } from 'pinia';
import { learningApi, type Learning } from '@/api/learning';

export const useLearningStore = defineStore('learning', {
  state: () => ({
    learnings: [] as Learning[],
    loading: false,
  }),
  actions: {
    async fetchLearnings() {
      this.loading = true;
      try {
        this.learnings = await learningApi.getAll();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async createLearning(data: Omit<Learning, 'id'>) {
      try {
        const created = await learningApi.create(data);
        this.learnings.unshift(created);
      } catch (err) {
        console.error(err);
      }
    },
    async updateLearning(id: string, data: Partial<Omit<Learning, 'id'>>) {
      try {
        const updated = await learningApi.update(id, data);
        const index = this.learnings.findIndex((l) => l.id === id);
        if (index !== -1) {
          this.learnings[index] = updated;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteLearning(id: string) {
      try {
        await learningApi.delete(id);
        this.learnings = this.learnings.filter((l) => l.id !== id);
      } catch (err) {
        console.error(err);
      }
    },
  },
});
