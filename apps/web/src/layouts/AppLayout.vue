<script setup lang="ts">
import {
  AcademicCapIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  FlagIcon,
  HomeIcon,
  TrophyIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { label: 'Daily Journal', to: '/journal', icon: BookOpenIcon },
  { label: 'Tasks', to: '/tasks', icon: ClipboardDocumentCheckIcon },
  { label: 'Work Log', to: '/work-log', icon: WrenchScrewdriverIcon },
  { label: 'Learning', to: '/learning', icon: AcademicCapIcon },
  { label: 'Achievements', to: '/achievements', icon: TrophyIcon },
  { label: 'Challenges', to: '/challenges', icon: FlagIcon },
  { label: 'Feedback', to: '/feedback', icon: ChatBubbleLeftRightIcon },
  { label: 'Weekly Reviews', to: '/weekly-reviews', icon: CalendarDaysIcon },
  { label: 'Monthly Reviews', to: '/monthly-reviews', icon: ChartBarIcon },
  { label: 'Reports', to: '/reports', icon: DocumentChartBarIcon },
  { label: 'Settings', to: '/settings', icon: Cog6ToothIcon },
];

async function logout() {
  await authStore.logout();
  await router.push({ name: 'login' });
}
</script>

<template>
  <div class="min-h-screen bg-ink-50">
    <aside class="fixed inset-y-0 left-0 hidden w-64 border-r border-ink-200 bg-white lg:block">
      <div class="flex h-16 items-center border-b border-ink-200 px-5">
        <div>
          <p class="text-sm font-semibold text-ink-900">DevTrack</p>
          <p class="text-xs text-ink-500">Career companion</p>
        </div>
      </div>
      <nav class="space-y-1 px-3 py-4">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-ink-700 hover:bg-ink-100"
          active-class="bg-blue-50 text-accent-600"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <div class="lg:pl-64">
      <header
        class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-ink-200 bg-white/90 px-4 backdrop-blur lg:px-8"
      >
        <div>
          <p class="text-sm font-medium text-ink-900">{{ authStore.user?.name }}</p>
          <p class="text-xs text-ink-500">{{ authStore.user?.email }}</p>
        </div>
        <button
          class="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
          type="button"
          @click="logout"
        >
          Logout
        </button>
      </header>
      <main class="px-4 py-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
