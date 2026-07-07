import { defineStore } from 'pinia';
import { reportApi, type ReportData, type ReportPayload } from '@/api/report';

export const useReportStore = defineStore('report', {
  state: () => ({
    reportData: null as ReportData | null,
    loading: false,
  }),
  actions: {
    async generateReport(payload: ReportPayload) {
      this.loading = true;
      try {
        this.reportData = await reportApi.generateData(payload);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    clearReport() {
      this.reportData = null;
    },
  },
});
