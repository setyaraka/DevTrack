import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppLayout from '@/layouts/AppLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DashboardView from '@/views/DashboardView.vue';
import JournalView from '@/views/JournalView.vue';
import TasksView from '@/views/TasksView.vue';
import WorkLogView from '@/views/WorkLogView.vue';
import LearningView from '@/views/LearningView.vue';
import FeedbackView from '@/views/FeedbackView.vue';
import AchievementsView from '@/views/AchievementsView.vue';
import ChallengesView from '@/views/ChallengesView.vue';
import WeeklyReviewsView from '@/views/WeeklyReviewsView.vue';
import MonthlyReviewsView from '@/views/MonthlyReviewsView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: LoginView },
        { path: 'register', name: 'register', component: RegisterView },
      ],
    },
    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', name: 'dashboard', component: DashboardView },
        { path: 'journal', name: 'journal', component: JournalView },
        { path: 'tasks', name: 'tasks', component: TasksView },
        { path: 'work-log', name: 'work-log', component: WorkLogView },
        { path: 'learning', name: 'learning', component: LearningView },
        { path: 'feedback', name: 'feedback', component: FeedbackView },
        { path: 'achievements', name: 'achievements', component: AchievementsView },
        { path: 'challenges', name: 'challenges', component: ChallengesView },
        { path: 'weekly-reviews', name: 'weekly-reviews', component: WeeklyReviewsView },
        { path: 'monthly-reviews', name: 'monthly-reviews', component: MonthlyReviewsView },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }

  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return { name: 'dashboard' };
  }

  return true;
});
