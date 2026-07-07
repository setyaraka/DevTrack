import { apiClient } from './client';

export interface DailyJournal {
  id?: string;
  date: string;
  reflection: string | null;
  summary: string | null;
  notes: string | null;
}

export const journalApi = {
  getJournal(date: string) {
    return apiClient.get<DailyJournal>('/journals', { params: { date } }).then((res) => res.data);
  },
  upsertJournal(data: { date: string; reflection?: string; summary?: string; notes?: string }) {
    return apiClient.post<DailyJournal>('/journals', data).then((res) => res.data);
  },
};
