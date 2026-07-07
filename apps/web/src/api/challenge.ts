import { apiClient } from './client';

export interface Challenge {
  id?: string;
  problem: string;
  rootCause?: string | null;
  solution?: string | null;
  result?: string | null;
  lessonsLearned?: string | null;
  date: string;
}

export const challengeApi = {
  getAll() {
    return apiClient.get<Challenge[]>('/challenges').then((res) => res.data);
  },
  create(data: Omit<Challenge, 'id'>) {
    return apiClient.post<Challenge>('/challenges', data).then((res) => res.data);
  },
  update(id: string, data: Partial<Omit<Challenge, 'id'>>) {
    return apiClient.patch<Challenge>(`/challenges/${id}`, data).then((res) => res.data);
  },
  delete(id: string) {
    return apiClient.delete<{ success: boolean }>(`/challenges/${id}`).then((res) => res.data);
  },
};
