<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import StatCard from '@/components/ui/StatCard.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import { ArrowPathIcon, BookOpenIcon, AcademicCapIcon, TrophyIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';

const store = useDashboardStore();

onMounted(() => {
  store.fetchStats();
});

const cards = computed(() => {
  if (!store.stats) return [];
  const c = store.stats.cards;
  return [
    { label: 'Total Tasks', value: c.totalTasks, caption: 'All tracked daily tasks' },
    { label: 'Completed Tasks', value: c.completedTasks, caption: 'Finished tasks' },
    { label: 'Completion Rate', value: c.completionRate, caption: 'Task completion rate' },
    { label: 'Bugs Solved', value: c.bugsSolved, caption: 'Bug fixes logged' },
    { label: 'Features Delivered', value: c.featuresDelivered, caption: 'New features shipped' },
    { label: 'Improvements', value: c.improvements, caption: 'Optimizations completed' },
    // { label: 'Learning Topics', value: c.learningTopics, caption: 'Growth topics tracked' },
    // { label: 'Achievements', value: c.achievements, caption: 'STAR success stories' },
    // { label: 'Challenges Logged', value: c.challenges, caption: 'Roadblocks handled' },
    // { label: 'Feedback Received', value: c.feedbackReceived, caption: 'Constructive review inputs' },
  ];
});

// Chart aggregations
const weeklyChart = computed(() => store.stats?.charts?.weeklyProductivity || []);
const categoryChart = computed(() => store.stats?.charts?.categoryDistribution || []);
const trendChart = computed(() => store.stats?.charts?.taskCompletionTrend || []);
const learningChart = computed(() => store.stats?.charts?.learningProgress || []);

// SVG Line Chart computations
const trendPath = computed(() => {
  if (trendChart.value.length === 0) return '';
  const width = 500;
  const height = 150;
  const padding = 20;
  const points = trendChart.value.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (trendChart.value.length - 1);
    const rate = item.total > 0 ? item.completed / item.total : 0;
    const y = height - padding - rate * (height - padding * 2);
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
});

const trendPoints = computed(() => {
  if (trendChart.value.length === 0) return [];
  const width = 500;
  const height = 150;
  const padding = 20;
  return trendChart.value.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / (trendChart.value.length - 1);
    const rate = item.total > 0 ? item.completed / item.total : 0;
    const y = height - padding - rate * (height - padding * 2);
    const percent = Math.round(rate * 100);
    return { x, y, label: item.date, percent };
  });
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Dashboard</h1>
        <p class="text-sm text-ink-500">Your engineering growth, productivity, and work metrics at a glance.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex min-h-[300px] flex-col items-center justify-center gap-2">
      <ArrowPathIcon class="h-8 w-8 animate-spin text-accent-500" />
      <p class="text-sm text-ink-500 font-medium">Calculating metrics...</p>
    </div>

    <template v-else-if="store.stats">
      <!-- Stats Cards -->
      <section class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          v-for="stat in cards"
          :key="stat.label"
          :label="stat.label"
          :value="stat.value"
          :caption="stat.caption"
        />
      </section>

      <!-- Charts grid -->
      <section class="grid gap-6 lg:grid-cols-2">
        
        <!-- Weekly productivity bars -->
        <BaseCard class="p-5 flex flex-col justify-between">
          <div>
            <h2 class="text-sm font-semibold text-ink-900 mb-4">Weekly Tasks Productivity</h2>
            <div class="flex h-44 items-end justify-between gap-2 px-2 pt-4 border-b border-ink-100 pb-2">
              <div
                v-for="day in weeklyChart"
                :key="day.day"
                class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
              >
                <!-- Stacked Bars -->
                <div class="w-full max-w-[24px] bg-ink-100 rounded-t-sm h-full flex flex-col justify-end overflow-hidden relative group">
                  <!-- Tooltip -->
                  <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-ink-900 text-white text-2xs px-2 py-1 rounded whitespace-nowrap z-10 shadow">
                    {{ day.completed }} / {{ day.total }} tasks
                  </div>
                  <!-- Total Bar -->
                  <div
                    class="w-full bg-ink-200"
                    :style="{ height: day.total > 0 ? '100%' : '0%' }"
                  >
                    <!-- Completed portion -->
                    <div
                      class="w-full bg-accent-600 transition-all duration-500"
                      :style="{ height: day.total > 0 ? `${(day.completed / day.total) * 100}%` : '0%' }"
                    ></div>
                  </div>
                </div>
                <span class="text-2xs font-semibold text-ink-500 mt-1">{{ day.day }}</span>
              </div>
            </div>
            <div class="mt-4 flex gap-4 justify-center text-2xs font-semibold text-ink-500">
              <span class="flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-accent-600"></span> Completed</span>
              <span class="flex items-center gap-1"><span class="h-2.5 w-2.5 rounded-full bg-ink-250"></span> Total Tasks</span>
            </div>
          </div>
        </BaseCard>

        <!-- Task Completion Rate Line Trend -->
        <BaseCard class="p-5">
          <h2 class="text-sm font-semibold text-ink-900 mb-4">Completion Rate Trend (Last 15 Days)</h2>
          <div class="relative h-44">
            <svg viewBox="0 0 500 150" class="w-full h-full overflow-visible">
              <!-- Grid lines -->
              <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1" />
              <line x1="20" y1="75" x2="480" y2="75" stroke="#f1f5f9" stroke-width="1" />
              <line x1="20" y1="130" x2="480" y2="130" stroke="#e2e8f0" stroke-width="1" />
              
              <!-- Trend Line -->
              <path
                v-if="trendPath"
                :d="trendPath"
                fill="none"
                stroke="rgb(37, 99, 235)"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              
              <!-- Points -->
              <circle
                v-for="(pt, idx) in trendPoints"
                :key="idx"
                :cx="pt.x"
                :cy="pt.y"
                r="4.5"
                class="fill-white stroke-accent-600 stroke-2 cursor-pointer hover:r-6 transition-all"
              >
                <title>{{ pt.label }}: {{ pt.percent }}%</title>
              </circle>
            </svg>
            <div class="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-3xs font-semibold text-ink-400">
              <span>{{ trendPoints[0]?.label }}</span>
              <span>{{ trendPoints[Math.floor(trendPoints.length / 2)]?.label }}</span>
              <span>{{ trendPoints[trendPoints.length - 1]?.label }}</span>
            </div>
          </div>
        </BaseCard>

        <!-- Work Log Category distribution -->
        <BaseCard class="p-5 space-y-4 lg:col-span-2">
          <h2 class="text-sm font-semibold text-ink-900">Work Log Category Distribution</h2>
          
          <div v-if="categoryChart.length === 0" class="flex h-36 items-center justify-center border border-dashed border-ink-150 rounded-lg">
            <p class="text-xs text-ink-400">No work log categories recorded yet.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-h-44 overflow-y-auto pr-1">
            <div v-for="item in categoryChart" :key="item.category" class="space-y-1">
              <div class="flex justify-between text-xs">
                <span class="font-medium text-ink-750 uppercase tracking-wide text-2xs">{{ item.category }}</span>
                <span class="font-bold text-ink-900">{{ item.count }} logs</span>
              </div>
              <div class="h-2 w-full rounded-full bg-ink-50 overflow-hidden border border-ink-100">
                <div
                  class="h-full bg-indigo-500 rounded-full"
                  :style="{ width: `${Math.min(100, (item.count / store.stats!.cards.totalTasks || 1) * 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Learning levels distribution -->
        <!-- <BaseCard class="p-5 space-y-4">
          <h2 class="text-sm font-semibold text-ink-900">Skill Understanding Levels</h2>
          
          <div v-if="learningChart.length === 0" class="flex h-36 items-center justify-center border border-dashed border-ink-150 rounded-lg">
            <p class="text-xs text-ink-400">No skills logged yet.</p>
          </div>

          <div v-else class="grid grid-cols-5 gap-3 h-36 items-end border-b border-ink-100 pb-2">
            <div v-for="item in learningChart" :key="item.level" class="flex flex-col items-center gap-2">
              <div
                class="w-full bg-amber-400 rounded-t-md hover:opacity-90 transition relative group"
                :style="{ height: `${Math.min(100, (item.count / store.stats!.cards.learningTopics || 1) * 100)}%` }"
              >
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-ink-900 text-white text-2xs px-2 py-1 rounded whitespace-nowrap shadow">
                  {{ item.count }} topics
                </div>
              </div>
              <span class="text-3xs font-bold text-ink-500 text-center whitespace-nowrap">{{ item.level }}</span>
            </div>
          </div>
        </BaseCard> -->

      </section>
    </template>
  </div>
</template>
