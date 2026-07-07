<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useSearchStore();
const route = useRoute();
const router = useRouter();

const queryInput = ref((route.query.q as string) || '');
const startDate = ref((route.query.startDate as string) || '');
const endDate = ref((route.query.endDate as string) || '');

const activeTab = ref<'tasks' | 'workLogs' | 'learnings' | 'achievements' | 'challenges' | 'feedback'>('tasks');

const performSearch = () => {
  store.setParams(queryInput.value, startDate.value, endDate.value);
  store.executeSearch();
  // Sync query parameters to route without reloading
  router.replace({
    query: {
      q: queryInput.value || undefined,
      startDate: startDate.value || undefined,
      endDate: endDate.value || undefined,
    },
  });
};

onMounted(() => {
  if (queryInput.value) {
    performSearch();
  }
});

// Watch query string parameter in case user searches from the header search bar
watch(() => route.query.q, (newVal) => {
  if (newVal !== undefined && newVal !== queryInput.value) {
    queryInput.value = newVal as string;
    performSearch();
  }
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-ink-900">Global Search</h1>
      <p class="text-sm text-ink-500">Query and filter across tasks, journals, work logs, learning notes, feedback, and reviews.</p>
    </div>

    <!-- Search Controls Card -->
    <div class="rounded-xl border border-ink-200 bg-white p-5 shadow-sm space-y-4">
      <form @submit.prevent="performSearch" class="flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-ink-400" />
          <input
            v-model="queryInput"
            type="text"
            placeholder="Search keywords in title, description, lessons learned..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-ink-250 bg-white text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          />
        </div>

        <div class="flex gap-2">
          <input
            v-model="startDate"
            type="date"
            class="rounded-lg border border-ink-250 bg-white px-2 py-2 text-sm text-ink-700 focus:outline-none"
            placeholder="Start Date"
          />
          <input
            v-model="endDate"
            type="date"
            class="rounded-lg border border-ink-250 bg-white px-2 py-2 text-sm text-ink-700 focus:outline-none"
            placeholder="End Date"
          />
          <BaseButton type="submit">Search</BaseButton>
        </div>
      </form>
    </div>

    <!-- Loading Indicator -->
    <div v-if="store.loading" class="flex min-h-[200px] flex-col items-center justify-center gap-2">
      <ArrowPathIcon class="h-8 w-8 animate-spin text-accent-500" />
      <p class="text-sm text-ink-500 font-medium">Searching archive...</p>
    </div>

    <template v-else-if="store.results">
      <!-- Search Tabs Navigation -->
      <div class="flex border-b border-ink-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          v-for="tab in ['tasks', 'workLogs', 'learnings', 'achievements', 'challenges', 'feedback']"
          :key="tab"
          @click="activeTab = tab as any"
          class="px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition uppercase tracking-wide text-xs"
          :class="activeTab === tab ? 'border-accent-600 text-accent-650' : 'border-transparent text-ink-500 hover:text-ink-750'"
        >
          {{ tab.replace('Logs', ' Logs').replace('s', 's').replace('feedback', 'Feedback') }}
          <span class="ml-1 px-1.5 py-0.5 rounded-full bg-ink-100 text-ink-600 text-3xs font-bold">
            {{ (store.results as any)[tab]?.length || 0 }}
          </span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="space-y-4">
        <!-- Tasks -->
        <div v-if="activeTab === 'tasks'" class="space-y-3">
          <div v-if="store.results.tasks.length === 0" class="py-12 text-center text-sm text-ink-450 bg-white rounded-xl border border-ink-150 border-dashed">No matching tasks found.</div>
          <div v-for="task in store.results.tasks" :key="task.id" class="rounded-xl border border-ink-150 bg-white p-4 flex justify-between items-center gap-4">
            <div class="min-w-0">
              <span class="text-xs text-ink-450">{{ new Date(task.date).toLocaleDateString() }}</span>
              <p class="text-sm font-semibold text-ink-900 truncate" :class="{ 'line-through text-ink-400': task.completed }">
                {{ task.title }}
              </p>
            </div>
            <span class="rounded-full px-2 py-0.5 text-2xs font-bold" :class="task.completed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'">
              {{ task.completed ? 'Completed' : 'Pending' }}
            </span>
          </div>
        </div>

        <!-- Work Logs -->
        <div v-if="activeTab === 'workLogs'" class="space-y-3">
          <div v-if="store.results.workLogs.length === 0" class="py-12 text-center text-sm text-ink-450 bg-white rounded-xl border border-ink-150 border-dashed">No matching work logs found.</div>
          <div v-for="log in store.results.workLogs" :key="log.id" class="rounded-xl border border-ink-150 bg-white p-5 space-y-2">
            <div class="flex items-center gap-2">
              <span class="rounded bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 text-2xs font-bold uppercase">{{ log.category }}</span>
              <span class="text-xs text-ink-450">{{ new Date(log.date).toLocaleDateString() }}</span>
            </div>
            <h3 class="text-sm font-bold text-ink-950">{{ log.title }}</h3>
            <p class="text-xs text-ink-650">{{ log.description }}</p>
          </div>
        </div>

        <!-- Learnings -->
        <div v-if="activeTab === 'learnings'" class="space-y-3">
          <div v-if="store.results.learnings.length === 0" class="py-12 text-center text-sm text-ink-450 bg-white rounded-xl border border-ink-150 border-dashed">No matching learning records found.</div>
          <div v-for="item in store.results.learnings" :key="item.id" class="rounded-xl border border-ink-150 bg-white p-5 space-y-2">
            <h3 class="text-sm font-bold text-ink-950">{{ item.topic }}</h3>
            <p class="text-xs text-ink-650">{{ item.description }}</p>
            <div class="flex gap-1 flex-wrap">
              <span v-for="tag in item.tags" :key="tag" class="rounded bg-ink-50 px-2 py-0.5 text-3xs font-medium text-ink-500 border border-ink-100">#{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div v-if="activeTab === 'achievements'" class="space-y-3">
          <div v-if="store.results.achievements.length === 0" class="py-12 text-center text-sm text-ink-450 bg-white rounded-xl border border-ink-150 border-dashed">No matching achievements found.</div>
          <div v-for="item in store.results.achievements" :key="item.id" class="rounded-xl border border-ink-150 bg-white p-5 space-y-3">
            <div class="flex items-center gap-2 border-b border-ink-100 pb-2">
              <span class="rounded bg-emerald-50 border border-emerald-150 text-emerald-700 px-2 py-0.5 text-2xs font-bold">{{ item.category }}</span>
              <span class="text-xs text-ink-450">{{ new Date(item.date).toLocaleDateString() }}</span>
            </div>
            <div class="grid gap-2 text-xs sm:grid-cols-2">
              <p><span class="font-bold text-ink-800">Situation:</span> {{ item.situation }}</p>
              <p><span class="font-bold text-ink-800">Task:</span> {{ item.task }}</p>
              <p><span class="font-bold text-ink-800">Action:</span> {{ item.action }}</p>
              <p><span class="font-bold text-ink-800">Result:</span> {{ item.result }}</p>
            </div>
          </div>
        </div>

        <!-- Challenges -->
        <div v-if="activeTab === 'challenges'" class="space-y-3">
          <div v-if="store.results.challenges.length === 0" class="py-12 text-center text-sm text-ink-450 bg-white rounded-xl border border-ink-150 border-dashed">No matching challenges found.</div>
          <div v-for="item in store.results.challenges" :key="item.id" class="rounded-xl border border-ink-150 bg-white p-5 space-y-2">
            <span class="text-xs text-ink-450">{{ new Date(item.date).toLocaleDateString() }}</span>
            <p class="text-sm font-bold text-ink-950">{{ item.problem }}</p>
            <p v-if="item.solution" class="text-xs text-ink-650"><span class="font-bold text-ink-800">Solution:</span> {{ item.solution }}</p>
            <p v-if="item.lessonsLearned" class="text-xs text-emerald-800 bg-emerald-50 bg-opacity-40 p-2 rounded"><span class="font-bold">Lesson:</span> {{ item.lessonsLearned }}</p>
          </div>
        </div>

        <!-- Feedback -->
        <div v-if="activeTab === 'feedback'" class="space-y-3">
          <div v-if="store.results.feedback.length === 0" class="py-12 text-center text-sm text-ink-450 bg-white rounded-xl border border-ink-150 border-dashed">No matching feedback found.</div>
          <div v-for="item in store.results.feedback" :key="item.id" class="rounded-xl border border-ink-150 bg-white p-5 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-ink-800">From: {{ item.reviewer }}</span>
              <span class="text-xs text-ink-450">{{ new Date(item.date).toLocaleDateString() }}</span>
            </div>
            <p class="text-xs text-ink-650 italic pl-3 border-l-2 border-ink-200">"{{ item.feedback }}"</p>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="flex flex-col items-center justify-center py-20 text-center border border-dashed border-ink-150 rounded-xl bg-white">
      <MagnifyingGlassIcon class="h-10 w-10 text-ink-300" />
      <h3 class="text-sm font-bold text-ink-700 mt-2">Ready to search</h3>
      <p class="text-xs text-ink-400 mt-1">Enter a keyword and date parameters to search your career history.</p>
    </div>
  </div>
</template>
