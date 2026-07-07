<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useWeeklyReviewStore } from '@/stores/weekly-review';
import { CheckIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

const store = useWeeklyReviewStore();

const getMonday = (dStr: string) => {
  const d = new Date(dStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const date = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const selectedWeekDate = ref(new Date().toISOString().split('T')[0]);
const weekStart = ref(getMonday(selectedWeekDate.value));

const biggestWin = ref('');
const biggestChallenge = ref('');
const lessonsLearned = ref('');
const nextWeekGoals = ref('');

const loadReview = async () => {
  await store.fetchReview(weekStart.value);
  biggestWin.value = store.review?.biggestWin || '';
  biggestChallenge.value = store.review?.biggestChallenge || '';
  lessonsLearned.value = store.review?.lessonsLearned || '';
  nextWeekGoals.value = store.review?.nextWeekGoals || '';
};

watch(selectedWeekDate, () => {
  weekStart.value = getMonday(selectedWeekDate.value);
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
      weekStart: weekStart.value,
      biggestWin: biggestWin.value,
      biggestChallenge: biggestChallenge.value,
      lessonsLearned: lessonsLearned.value,
      nextWeekGoals: nextWeekGoals.value,
    });
  }, 1000);
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Weekly Reviews</h1>
        <p class="text-sm text-ink-500">Reflect on your weekly progress, achievements, challenges, and goals.</p>
      </div>

      <!-- Week Picker -->
      <div class="flex items-center gap-2">
        <label class="text-xs font-semibold text-ink-500 uppercase tracking-wider">Select Week:</label>
        <input
          v-model="selectedWeekDate"
          type="date"
          class="h-9 rounded-md border border-ink-200 bg-white px-3 text-sm font-medium text-ink-800 shadow-sm focus:border-accent-500 focus:outline-none"
        />
      </div>
    </div>

    <!-- Review Form Card -->
    <div class="rounded-xl border border-ink-200 bg-white p-6 shadow-sm space-y-6">
      <div class="flex items-center justify-between border-b border-ink-100 pb-3">
        <h2 class="text-lg font-semibold text-ink-955">
          Review for Week of Monday, {{ new Date(weekStart).toLocaleDateString() }}
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
        <p class="text-sm text-ink-500 font-medium">Loading weekly review...</p>
      </div>

      <div v-else class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-ink-800">1. What was your biggest win this week?</label>
          <textarea
            v-model="biggestWin"
            @input="handleInput"
            placeholder="Highlight your key achievements, deliverables completed, or obstacles overcome."
            class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-ink-800">2. What was your biggest challenge / blocker?</label>
          <textarea
            v-model="biggestChallenge"
            @input="handleInput"
            placeholder="Describe any hurdles, design questions, or technical roadblocks you faced."
            class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-ink-800">3. What were the key lessons learned?</label>
          <textarea
            v-model="lessonsLearned"
            @input="handleInput"
            placeholder="What technical insights, patterns, or process improvements did you take away?"
            class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-semibold text-ink-800">4. What are your main goals for next week?</label>
          <textarea
            v-model="nextWeekGoals"
            @input="handleInput"
            placeholder="List specific milestones, learning topics, or task items you plan to target next week."
            class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
