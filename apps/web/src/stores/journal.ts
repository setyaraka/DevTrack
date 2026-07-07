import { defineStore } from 'pinia';
import { journalApi, type DailyJournal } from '@/api/journal';
import { taskApi, type DailyTask } from '@/api/tasks';

interface JournalState {
  selectedDate: string;
  tasks: DailyTask[];
  journal: DailyJournal | null;
  loading: boolean;
  saving: boolean;
}

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useJournalStore = defineStore('journal', {
  state: (): JournalState => ({
    selectedDate: getLocalDateString(),
    tasks: [],
    journal: null,
    loading: false,
    saving: false,
  }),
  actions: {
    setSelectedDate(date: string) {
      this.selectedDate = date;
    },
    async fetchDayData() {
      this.loading = true;
      try {
        const [journalData, tasksData] = await Promise.all([
          journalApi.getJournal(this.selectedDate),
          taskApi.getTasks(this.selectedDate),
        ]);
        this.journal = journalData;
        this.tasks = tasksData;
      } catch (err) {
        console.error('Failed to fetch day data:', err);
      } finally {
        this.loading = false;
      }
    },
    async createTask(title: string, priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT', dueDate?: string | null) {
      try {
        const newTask = await taskApi.createTask({
          title,
          priority,
          date: this.selectedDate,
          dueDate,
        });
        this.tasks.push(newTask);
      } catch (err) {
        console.error('Failed to create task:', err);
      }
    },
    async toggleTask(taskId: string, completed: boolean) {
      try {
        // Optimistic update
        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex].completed = completed;
        }
        await taskApi.updateTask(taskId, { completed });
      } catch (err) {
        console.error('Failed to toggle task:', err);
        // Rollback
        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex].completed = !completed;
        }
      }
    },
    async updateTaskPriority(taskId: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') {
      try {
        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex].priority = priority;
        }
        await taskApi.updateTask(taskId, { priority });
      } catch (err) {
        console.error('Failed to update task priority:', err);
      }
    },
    async deleteTask(taskId: string) {
      try {
        await taskApi.deleteTask(taskId);
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    },
    async saveJournal(reflection?: string, summary?: string, notes?: string) {
      this.saving = true;
      try {
        const updated = await journalApi.upsertJournal({
          date: this.selectedDate,
          reflection,
          summary,
          notes,
        });
        this.journal = updated;
      } catch (err) {
        console.error('Failed to save journal:', err);
      } finally {
        this.saving = false;
      }
    },
    async triggerRollover() {
      try {
        const res = await taskApi.rolloverTasks(this.selectedDate);
        if (res.rolledOverCount > 0) {
          await this.fetchDayData();
        }
        return res.rolledOverCount;
      } catch (err) {
        console.error('Failed to trigger rollover:', err);
        return 0;
      }
    },
  },
});
