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
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

const searchQuery = ref('');
const handleHeaderSearch = () => {
  if (!searchQuery.value.trim()) return;
  router.push({ name: 'search', query: { q: searchQuery.value } });
  searchQuery.value = '';
};

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
        class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-ink-200 bg-white/90 px-4 backdrop-blur lg:px-8 gap-4"
      >
        <!-- Quick Search Bar -->
        <form @submit.prevent="handleHeaderSearch" class="flex-1 max-w-sm relative hidden sm:block">
          <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-ink-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Quick search career logs..."
            class="w-full pl-9 pr-4 py-1.5 rounded-lg border border-ink-250 bg-ink-50/50 text-xs focus:border-accent-500 focus:outline-none focus:bg-white transition"
          />
        </form>

        <div class="flex items-center gap-4 ml-auto">
          <div class="text-right">
            <p class="text-xs font-semibold text-ink-900 leading-none">{{ authStore.user?.name }}</p>
            <p class="text-4xs text-ink-455 mt-1">{{ authStore.user?.email }}</p>
          </div>
          <button
            class="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50"
            type="button"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </header>
      <main class="px-4 py-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
