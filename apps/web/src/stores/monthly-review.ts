import { defineStore } from 'pinia';
import { monthlyReviewApi, type MonthlyReview } from '@/api/monthly-review';

export const useMonthlyReviewStore = defineStore('monthly-review', {
  state: () => ({
    review: null as MonthlyReview | null,
    loading: false,
    saving: false,
  }),
  actions: {
    async fetchReview(monthStart: string) {
      this.loading = true;
      try {
        this.review = await monthlyReviewApi.getReview(monthStart);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async saveReview(data: MonthlyReview) {
      this.saving = true;
      try {
        this.review = await monthlyReviewApi.upsertReview(data);
      } catch (err) {
        console.error(err);
      } finally {
        this.saving = false;
      }
    },
  },
});
