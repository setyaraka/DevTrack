import { apiClient } from './client';

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  order: number;
  dueDate: string | null;
  date: string;
  rolledOverFromId: string | null;
  journalId: string | null;
}

export const taskApi = {
  getTasks(date: string) {
    return apiClient.get<DailyTask[]>('/tasks', { params: { date } }).then((res) => res.data);
  },
  createTask(data: { title: string; priority?: string; date: string; dueDate?: string | null }) {
    return apiClient.post<DailyTask>('/tasks', data).then((res) => res.data);
  },
  updateTask(id: string, data: { title?: string; completed?: boolean; priority?: string; order?: number; dueDate?: string | null }) {
    return apiClient.patch<DailyTask>(`/tasks/${id}`, data).then((res) => res.data);
  },
  deleteTask(id: string) {
    return apiClient.delete<{ success: boolean }>(`/tasks/${id}`).then((res) => res.data);
  },
  rolloverTasks(targetDate: string) {
    return apiClient
      .post<{ rolledOverCount: number; tasks?: DailyTask[] }>('/tasks/rollover', { targetDate })
      .then((res) => res.data);
  },
};
