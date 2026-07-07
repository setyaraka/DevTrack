import { defineStore } from 'pinia';
import { weeklyReviewApi, type WeeklyReview } from '@/api/weekly-review';

export const useWeeklyReviewStore = defineStore('weekly-review', {
  state: () => ({
    review: null as WeeklyReview | null,
    loading: false,
    saving: false,
  }),
  actions: {
    async fetchReview(weekStart: string) {
      this.loading = true;
      try {
        this.review = await weeklyReviewApi.getReview(weekStart);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async saveReview(data: WeeklyReview) {
      this.saving = true;
      try {
        this.review = await weeklyReviewApi.upsertReview(data);
      } catch (err) {
        console.error(err);
      } finally {
        this.saving = false;
      }
    },
  },
});
