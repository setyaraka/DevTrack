import { apiClient } from './client';

export interface Learning {
  id?: string;
  topic: string;
  description?: string | null;
  understandingLevel: number;
  tags: string[];
}

export const learningApi = {
  getAll() {
    return apiClient.get<Learning[]>('/learnings').then((res) => res.data);
  },
  create(data: Omit<Learning, 'id'>) {
    return apiClient.post<Learning>('/learnings', data).then((res) => res.data);
  },
  update(id: string, data: Partial<Omit<Learning, 'id'>>) {
    return apiClient.patch<Learning>(`/learnings/${id}`, data).then((res) => res.data);
  },
  delete(id: string) {
    return apiClient.delete<{ success: boolean }>(`/learnings/${id}`).then((res) => res.data);
  },
};
