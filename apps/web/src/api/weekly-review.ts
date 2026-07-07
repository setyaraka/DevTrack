import { apiClient } from './client';

export interface WeeklyReview {
  id?: string;
  weekStart: string;
  biggestWin?: string | null;
  biggestChallenge?: string | null;
  lessonsLearned?: string | null;
  nextWeekGoals?: string | null;
}

export const weeklyReviewApi = {
  getReview(weekStart: string) {
    return apiClient.get<WeeklyReview>('/weekly-reviews', { params: { weekStart } }).then((res) => res.data);
  },
  upsertReview(data: WeeklyReview) {
    return apiClient.post<WeeklyReview>('/weekly-reviews', data).then((res) => res.data);
  },
};
