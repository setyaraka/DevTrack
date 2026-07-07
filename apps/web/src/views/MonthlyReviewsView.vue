<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useMonthlyReviewStore } from '@/stores/monthly-review';
import { CheckIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

const store = useMonthlyReviewStore();

const getMonthStart = (mStr: string) => {
  return `${mStr}-01`;
};

const currentMonth = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const selectedMonth = ref(currentMonth());
const monthStart = ref(getMonthStart(selectedMonth.value));

const summary = ref('');
const reflection = ref('');
const managerFeedback = ref('');
const personalNotes = ref('');

const loadReview = async () => {
  await store.fetchReview(monthStart.value);
  summary.value = store.review?.summary || '';
  reflection.value = store.review?.reflection || '';
  managerFeedback.value = store.review?.managerFeedback || '';
  personalNotes.value = store.review?.personalNotes || '';
};

watch(selectedMonth, () => {
  monthStart.value = getMonthStart(selectedMonth.value);
  loadReview();
});

onMounted(() => {
  loadReview();
});

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const handleInput = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    store.saveReview({
      monthStart: monthStart.value,
      summary: summary.value,
      reflection: reflection.value,
      managerFeedback: managerFeedback.value,
      personalNotes: personalNotes.value,
    });
  }, 1000);
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Monthly Reviews</h1>
        <p class="text-sm text-ink-500">Conduct high-level monthly summaries and store manager feedback alignment.</p>
      </div>

      <!-- Month Picker -->
      <div class="flex items-center gap-2">
        <label class="text-xs font-semibold text-ink-500 uppercase tracking-wider">Select Month:</label>
        <input
          v-model="selectedMonth"
          type="month"
          class="h-9 rounded-md border border-ink-200 bg-white px-3 text-sm font-medium text-ink-800 shadow-sm focus:border-accent-500 focus:outline-none"
        />
      </div>
    </div>

    <!-- Review Form Card -->
    <div class="rounded-xl border border-ink-200 bg-white p-6 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-ink-100 pb-3">
        <h2 class="text-lg font-semibold text-ink-955">
          Review for {{ new Date(monthStart).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) }}
        </h2>
        <span class="text-xs font-medium text-ink-400">
          <span v-if="store.saving" class="flex items-center gap-1">
            <ArrowPathIcon class="h-3 w-3 animate-spin text-ink-400" /> Saving...
          </span>
          <span v-else class="flex items-center gap-0.5">
            <CheckIcon class="h-3.5 w-3.5 text-emerald-500" /> Saved
          </span>
        </span>
      </div>

      <div v-if="store.loading" class="flex min-h-[250px] flex-col items-center justify-center gap-2">
        <ArrowPathIcon class="h-8 w-8 animate-spin text-accent-500" />
        <p class="text-sm text-ink-500 font-medium">Loading monthly review...</p>
      </div>

      <div v-else class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-ink-800">1. Month Summary</label>
          <textarea
            v-model="summary"
            @input="handleInput"
            placeholder="High level overview of projects shipped, tasks resolved, and key contributions."
            class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-ink-800">2. Reflection & Self-Evaluation</label>
          <textarea
            v-model="reflection"
            @input="handleInput"
            placeholder="What went well? What are you improving? Any skill growth reflections?"
            class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-ink-800">3. Manager Feedback Alignment</label>
          <textarea
            v-model="managerFeedback"
            @input="handleInput"
            placeholder="Record feedback from 1-on-1s, syncs, or formal monthly reviews with leadership."
            class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-ink-800">4. Personal Notes & Career Progression Goals</label>
          <textarea
            v-model="personalNotes"
            @input="handleInput"
            placeholder="Long-term tracking notes, roadmap milestones, promotion checkpoints..."
            class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
