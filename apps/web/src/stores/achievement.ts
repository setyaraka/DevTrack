import { defineStore } from 'pinia';
import { achievementApi, type Achievement } from '@/api/achievement';

export const useAchievementStore = defineStore('achievement', {
  state: () => ({
    achievements: [] as Achievement[],
    loading: false,
  }),
  actions: {
    async fetchAchievements() {
      this.loading = true;
      try {
        this.achievements = await achievementApi.getAll();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async createAchievement(data: Omit<Achievement, 'id'>) {
      try {
        const created = await achievementApi.create(data);
        this.achievements.unshift(created);
      } catch (err) {
        console.error(err);
      }
    },
    async updateAchievement(id: string, data: Partial<Omit<Achievement, 'id'>>) {
      try {
        const updated = await achievementApi.update(id, data);
        const index = this.achievements.findIndex((l) => l.id === id);
        if (index !== -1) {
          this.achievements[index] = updated;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteAchievement(id: string) {
      try {
        await achievementApi.delete(id);
        this.achievements = this.achievements.filter((l) => l.id !== id);
      } catch (err) {
        console.error(err);
      }
    },
  },
});
