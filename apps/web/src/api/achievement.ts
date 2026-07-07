import { apiClient } from './client';

export interface Achievement {
  id?: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  impact?: string | null;
  category: 'DELIVERY' | 'QUALITY' | 'LEADERSHIP' | 'COLLABORATION' | 'LEARNING' | 'IMPACT';
  date: string;
}

export const achievementApi = {
  getAll() {
    return apiClient.get<Achievement[]>('/achievements').then((res) => res.data);
  },
  create(data: Omit<Achievement, 'id'>) {
    return apiClient.post<Achievement>('/achievements', data).then((res) => res.data);
  },
  update(id: string, data: Partial<Omit<Achievement, 'id'>>) {
    return apiClient.patch<Achievement>(`/achievements/${id}`, data).then((res) => res.data);
  },
  delete(id: string) {
    return apiClient.delete<{ success: boolean }>(`/achievements/${id}`).then((res) => res.data);
  },
};
