import { apiClient } from './client';

export interface MonthlyReview {
  id?: string;
  monthStart: string;
  summary?: string | null;
  reflection?: string | null;
  managerFeedback?: string | null;
  personalNotes?: string | null;
}

export const monthlyReviewApi = {
  getReview(monthStart: string) {
    return apiClient.get<MonthlyReview>('/monthly-reviews', { params: { monthStart } }).then((res) => res.data);
  },
  upsertReview(data: MonthlyReview) {
    return apiClient.post<MonthlyReview>('/monthly-reviews', data).then((res) => res.data);
  },
};
