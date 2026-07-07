import { apiClient } from './client';

export interface Feedback {
  id?: string;
  reviewer: string;
  feedback: string;
  category: 'CODE_REVIEW' | 'DESIGN' | 'COMMUNICATION' | 'PROCESS' | 'TECHNICAL' | 'LEADERSHIP' | 'OTHER';
  applied: boolean;
  date: string;
}

export const feedbackApi = {
  getAll() {
    return apiClient.get<Feedback[]>('/feedbacks').then((res) => res.data);
  },
  create(data: Omit<Feedback, 'id'>) {
    return apiClient.post<Feedback>('/feedbacks', data).then((res) => res.data);
  },
  update(id: string, data: Partial<Omit<Feedback, 'id'>>) {
    return apiClient.patch<Feedback>(`/feedbacks/${id}`, data).then((res) => res.data);
  },
  delete(id: string) {
    return apiClient.delete<{ success: boolean }>(`/feedbacks/${id}`).then((res) => res.data);
  },
};
