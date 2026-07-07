import { apiClient } from './client';
import type { DailyTask } from './tasks';
import type { WorkLog } from './work-log';
import type { Learning } from './learning';
import type { Achievement } from './achievement';
import type { Challenge } from './challenge';
import type { Feedback } from './feedback';

export interface SearchResults {
  tasks: DailyTask[];
  workLogs: WorkLog[];
  learnings: Learning[];
  achievements: Achievement[];
  challenges: Challenge[];
  feedback: Feedback[];
}

export const searchApi = {
  search(params: { q: string; startDate?: string; endDate?: string; page?: number; limit?: number }) {
    return apiClient.get<SearchResults>('/search', { params }).then((res) => res.data);
  },
};
