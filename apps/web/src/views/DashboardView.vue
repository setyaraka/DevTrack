<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue';
import StatCard from '@/components/ui/StatCard.vue';

const stats = [
  { label: 'Total Tasks', value: 0, caption: 'All tracked daily tasks' },
  { label: 'Completed Tasks', value: 0, caption: 'Finished tasks' },
  { label: 'Completion Rate', value: '0%', caption: 'Across selected period' },
  { label: 'Bugs Solved', value: 0, caption: 'Work log category' },
  { label: 'Features Delivered', value: 0, caption: 'Shipped feature records' },
  { label: 'Learning Topics', value: 0, caption: 'Tracked growth areas' },
  { label: 'Achievements', value: 0, caption: 'STAR stories captured' },
  { label: 'Feedback Received', value: 0, caption: 'Reviewer notes' },
];

const chartPlaceholders = [
  'Weekly Productivity',
  'Monthly Productivity',
  'Task Completion Trend',
  'Learning Progress',
  'Category Distribution',
];
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h1 class="text-2xl font-semibold text-ink-900">Dashboard</h1>
        <p class="mt-1 text-sm text-ink-500">Your engineering progress at a glance.</p>
      </div>
      <div class="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-500">
        Phase 1 foundation
      </div>
    </div>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :caption="stat.caption"
      />
    </section>

    <section class="grid gap-4 xl:grid-cols-2">
      <BaseCard v-for="chart in chartPlaceholders" :key="chart" class="min-h-72 p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-ink-900">{{ chart }}</h2>
          <span class="rounded-md bg-ink-100 px-2 py-1 text-xs font-medium text-ink-500">Soon</span>
        </div>
        <div class="mt-8 flex h-44 items-center justify-center rounded-md border border-dashed border-ink-200">
          <p class="text-sm text-ink-500">Analytics data will appear here in Phase 4.</p>
        </div>
      </BaseCard>
    </section>
  </div>
</template>
