import { defineStore } from 'pinia';
import { challengeApi, type Challenge } from '@/api/challenge';

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    challenges: [] as Challenge[],
    loading: false,
  }),
  actions: {
    async fetchChallenges() {
      this.loading = true;
      try {
        this.challenges = await challengeApi.getAll();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async createChallenge(data: Omit<Challenge, 'id'>) {
      try {
        const created = await challengeApi.create(data);
        this.challenges.unshift(created);
      } catch (err) {
        console.error(err);
      }
    },
    async updateChallenge(id: string, data: Partial<Omit<Challenge, 'id'>>) {
      try {
        const updated = await challengeApi.update(id, data);
        const index = this.challenges.findIndex((l) => l.id === id);
        if (index !== -1) {
          this.challenges[index] = updated;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteChallenge(id: string) {
      try {
        await challengeApi.delete(id);
        this.challenges = this.challenges.filter((l) => l.id !== id);
      } catch (err) {
        console.error(err);
      }
    },
  },
});
