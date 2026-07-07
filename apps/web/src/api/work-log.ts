import { apiClient } from './client';

export interface WorkLog {
  id?: string;
  title: string;
  description: string;
  category: 'BUG' | 'FEATURE' | 'IMPROVEMENT' | 'RESEARCH' | 'MEETING' | 'DISCUSSION' | 'REFACTOR' | 'DOCUMENTATION' | 'TESTING';
  date: string;
  impact?: string | null;
  relatedPr?: string | null;
}

export const workLogApi = {
  getAll() {
    return apiClient.get<WorkLog[]>('/work-logs').then((res) => res.data);
  },
  create(data: Omit<WorkLog, 'id'>) {
    return apiClient.post<WorkLog>('/work-logs', data).then((res) => res.data);
  },
  update(id: string, data: Partial<Omit<WorkLog, 'id'>>) {
    return apiClient.patch<WorkLog>(`/work-logs/${id}`, data).then((res) => res.data);
  },
  delete(id: string) {
    return apiClient.delete<{ success: boolean }>(`/work-logs/${id}`).then((res) => res.data);
  },
};
