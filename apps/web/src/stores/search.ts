import { defineStore } from 'pinia';
import { searchApi, type SearchResults } from '@/api/search';

export const useSearchStore = defineStore('search', {
  state: () => ({
    results: null as SearchResults | null,
    loading: false,
    query: '',
    startDate: '',
    endDate: '',
  }),
  actions: {
    async executeSearch(page = 1, limit = 20) {
      if (!this.query.trim()) {
        this.results = null;
        return;
      }
      this.loading = true;
      try {
        this.results = await searchApi.search({
          q: this.query,
          startDate: this.startDate || undefined,
          endDate: this.endDate || undefined,
          page,
          limit,
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    setParams(q: string, start = '', end = '') {
      this.query = q;
      this.startDate = start;
      this.endDate = end;
    },
  },
});
