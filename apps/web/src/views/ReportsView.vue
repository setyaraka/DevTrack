<script setup lang="ts">
import { ref } from 'vue';
import { useReportStore } from '@/stores/report';
import { ArrowPathIcon, PrinterIcon, EyeIcon } from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useReportStore();

const startDate = ref(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

const selectedSections = ref<string[]>(['tasks', 'workLogs', 'learnings', 'achievements', 'challenges', 'feedback']);

const sections = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'workLogs', label: 'Work Logs' },
  { id: 'learnings', label: 'Learnings' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'feedback', label: 'Feedback' },
];

const handlePreview = async () => {
  await store.generateReport({
    startDate: startDate.value,
    endDate: endDate.value,
    sections: selectedSections.value,
  });
};

const handlePrint = () => {
  window.print();
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center print:hidden">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Report Generator</h1>
        <p class="text-sm text-ink-500">Compile and preview custom engineering summaries for your performance reviews.</p>
      </div>
    </div>

    <!-- Configuration Options Card -->
    <div class="rounded-xl border border-ink-200 bg-white p-6 shadow-sm space-y-5 print:hidden">
      <h2 class="text-base font-bold text-ink-900">Report Settings</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-1">
          <label class="text-xs font-semibold text-ink-700">Start Date</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs font-semibold text-ink-700">End Date</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
          />
        </div>
      </div>

      <!-- Section checkboxes -->
      <div class="space-y-2">
        <span class="text-xs font-semibold text-ink-700 block">Include Sections</span>
        <div class="flex flex-wrap gap-4">
          <label
            v-for="sec in sections"
            :key="sec.id"
            class="flex items-center gap-2 text-sm text-ink-700 cursor-pointer"
          >
            <input
              v-model="selectedSections"
              type="checkbox"
              :value="sec.id"
              class="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
            />
            <span>{{ sec.label }}</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <BaseButton @click="handlePreview" class="flex items-center gap-1.5">
          <EyeIcon class="h-5 w-5" />
          <span>Generate Preview</span>
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex min-h-[200px] flex-col items-center justify-center gap-2 print:hidden">
      <ArrowPathIcon class="h-8 w-8 animate-spin text-accent-500" />
      <p class="text-sm text-ink-500 font-medium">Gathering performance records...</p>
    </div>

    <!-- Preview & Print -->
    <template v-else-if="store.reportData">
      <div class="flex justify-between items-center print:hidden border-t border-ink-200 pt-6">
        <h2 class="text-lg font-bold text-ink-900">Report Preview</h2>
        <BaseButton variant="secondary" @click="handlePrint" class="flex items-center gap-1.5">
          <PrinterIcon class="h-5 w-5" />
          <span>Print / Save PDF</span>
        </BaseButton>
      </div>

      <!-- Printable Report Sheet -->
      <div class="rounded-xl border border-ink-200 bg-white p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        <!-- Report Header -->
        <div class="border-b-2 border-ink-900 pb-5 space-y-1">
          <h1 class="text-3xl font-extrabold text-ink-950">DevTrack Career Summary</h1>
          <p class="text-sm font-semibold text-ink-500">
            Reporting Period: {{ new Date(store.reportData.startDate).toLocaleDateString() }} to {{ new Date(store.reportData.endDate).toLocaleDateString() }}
          </p>
        </div>

        <!-- Tasks Section -->
        <div v-if="store.reportData.tasks && store.reportData.tasks.length > 0" class="space-y-3">
          <h2 class="text-lg font-bold text-ink-900 border-b border-ink-200 pb-1.5">Tasks Overview</h2>
          <ul class="list-disc list-inside space-y-1 text-sm text-ink-855">
            <li v-for="t in store.reportData.tasks" :key="t.id" :class="{ 'line-through text-ink-450': t.completed }">
              <span class="font-semibold text-ink-500">[{{ new Date(t.date).toLocaleDateString() }}]</span> {{ t.title }}
            </li>
          </ul>
        </div>

        <!-- Work Logs Section -->
        <div v-if="store.reportData.workLogs && store.reportData.workLogs.length > 0" class="space-y-4">
          <h2 class="text-lg font-bold text-ink-900 border-b border-ink-200 pb-1.5">Work Logs & Deliverables</h2>
          <div class="space-y-3">
            <div v-for="log in store.reportData.workLogs" :key="log.id" class="text-sm space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-accent-700 uppercase text-xs">[{{ log.category }}]</span>
                <span class="text-xs text-ink-450 font-medium">{{ new Date(log.date).toLocaleDateString() }}</span>
                <span class="font-bold text-ink-900">{{ log.title }}</span>
              </div>
              <p class="text-ink-700 pl-4">{{ log.description }}</p>
              <p v-if="log.impact" class="text-emerald-700 font-semibold pl-4 text-xs">Impact: {{ log.impact }}</p>
            </div>
          </div>
        </div>

        <!-- Learnings Section -->
        <div v-if="store.reportData.learnings && store.reportData.learnings.length > 0" class="space-y-3">
          <h2 class="text-lg font-bold text-ink-900 border-b border-ink-200 pb-1.5">Skills & Growth</h2>
          <div class="space-y-3">
            <div v-for="item in store.reportData.learnings" :key="item.id" class="text-sm">
              <p class="font-bold text-ink-900">{{ item.topic }} <span class="text-xs font-normal text-ink-500">(Understanding Level: {{ item.understandingLevel }}/5)</span></p>
              <p class="text-ink-750">{{ item.description }}</p>
            </div>
          </div>
        </div>

        <!-- Achievements Section -->
        <div v-if="store.reportData.achievements && store.reportData.achievements.length > 0" class="space-y-4">
          <h2 class="text-lg font-bold text-ink-900 border-b border-ink-200 pb-1.5">STAR Achievements</h2>
          <div class="space-y-4">
            <div v-for="item in store.reportData.achievements" :key="item.id" class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="font-bold text-indigo-700 text-xs uppercase">{{ item.category }}</span>
                <span class="text-xs text-ink-450">{{ new Date(item.date).toLocaleDateString() }}</span>
              </div>
              <div class="grid gap-2 sm:grid-cols-2 bg-ink-50 p-3 rounded-lg print:bg-white print:border print:p-2">
                <p><span class="font-semibold text-ink-800">Situation:</span> {{ item.situation }}</p>
                <p><span class="font-semibold text-ink-800">Task:</span> {{ item.task }}</p>
                <p><span class="font-semibold text-ink-800">Action:</span> {{ item.action }}</p>
                <p><span class="font-semibold text-ink-800">Result:</span> {{ item.result }}</p>
              </div>
              <p v-if="item.impact" class="text-emerald-700 font-semibold pl-2 text-xs">Impact: {{ item.impact }}</p>
            </div>
          </div>
        </div>

        <!-- Challenges Section -->
        <div v-if="store.reportData.challenges && store.reportData.challenges.length > 0" class="space-y-3">
          <h2 class="text-lg font-bold text-ink-900 border-b border-ink-200 pb-1.5">Challenges Overcome</h2>
          <div class="space-y-3">
            <div v-for="item in store.reportData.challenges" :key="item.id" class="text-sm space-y-1">
              <p class="font-bold text-ink-900">{{ item.problem }}</p>
              <p v-if="item.solution" class="text-ink-700"><span class="font-semibold">Solution:</span> {{ item.solution }}</p>
              <p v-if="item.lessonsLearned" class="text-emerald-800 bg-emerald-50 bg-opacity-40 p-2 rounded text-xs print:bg-white print:border"><span class="font-bold">Lesson:</span> {{ item.lessonsLearned }}</p>
            </div>
          </div>
        </div>

        <!-- Feedback Section -->
        <div v-if="store.reportData.feedback && store.reportData.feedback.length > 0" class="space-y-3">
          <h2 class="text-lg font-bold text-ink-900 border-b border-ink-200 pb-1.5">Feedback Received</h2>
          <div class="space-y-2">
            <div v-for="item in store.reportData.feedback" :key="item.id" class="text-sm italic pl-3 border-l-2 border-ink-200">
              <p class="text-ink-800">"{{ item.feedback }}"</p>
              <p class="text-xs font-semibold text-ink-500 not-italic mt-0.5">— From {{ item.reviewer }} ({{ item.category.replace('_', ' ') }})</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
