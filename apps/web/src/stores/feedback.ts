import { defineStore } from 'pinia';
import { feedbackApi, type Feedback } from '@/api/feedback';

export const useFeedbackStore = defineStore('feedback', {
  state: () => ({
    feedbacks: [] as Feedback[],
    loading: false,
  }),
  actions: {
    async fetchFeedbacks() {
      this.loading = true;
      try {
        this.feedbacks = await feedbackApi.getAll();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async createFeedback(data: Omit<Feedback, 'id'>) {
      try {
        const created = await feedbackApi.create(data);
        this.feedbacks.unshift(created);
      } catch (err) {
        console.error(err);
      }
    },
    async updateFeedback(id: string, data: Partial<Omit<Feedback, 'id'>>) {
      try {
        const updated = await feedbackApi.update(id, data);
        const index = this.feedbacks.findIndex((l) => l.id === id);
        if (index !== -1) {
          this.feedbacks[index] = updated;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteFeedback(id: string) {
      try {
        await feedbackApi.delete(id);
        this.feedbacks = this.feedbacks.filter((l) => l.id !== id);
      } catch (err) {
        console.error(err);
      }
    },
  },
});
