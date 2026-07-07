import { apiClient } from './client';
import type { DailyTask } from './tasks';
import type { WorkLog } from './work-log';
import type { Learning } from './learning';
import type { Achievement } from './achievement';
import type { Challenge } from './challenge';
import type { Feedback } from './feedback';

export interface ReportPayload {
  startDate: string;
  endDate: string;
  sections: string[];
}

export interface ReportData {
  startDate: string;
  endDate: string;
  tasks?: DailyTask[];
  workLogs?: WorkLog[];
  learnings?: Learning[];
  achievements?: Achievement[];
  challenges?: Challenge[];
  feedback?: Feedback[];
}

export const reportApi = {
  generateData(data: ReportPayload) {
    return apiClient.post<ReportData>('/reports/data', data).then((res) => res.data);
  },
};
