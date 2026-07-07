<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useWorkLogStore } from '@/stores/work-log';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilIcon } from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useWorkLogStore();

const showForm = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  title: '',
  description: '',
  category: 'FEATURE' as any,
  date: new Date().toISOString().split('T')[0],
  impact: '',
  relatedPr: '',
});

const filterCategory = ref('ALL');

const categories = [
  'BUG', 'FEATURE', 'IMPROVEMENT', 'RESEARCH', 'MEETING', 'DISCUSSION', 'REFACTOR', 'DOCUMENTATION', 'TESTING'
];

onMounted(() => {
  store.fetchLogs();
});

const filteredLogs = computed(() => {
  if (filterCategory.value === 'ALL') return store.logs;
  return store.logs.filter((log) => log.category === filterCategory.value);
});

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    category: 'FEATURE',
    date: new Date().toISOString().split('T')[0],
    impact: '',
    relatedPr: '',
  };
  editingId.value = null;
  showForm.value = false;
};

const handleEdit = (log: any) => {
  editingId.value = log.id;
  form.value = {
    title: log.title,
    description: log.description,
    category: log.category,
    date: new Date(log.date).toISOString().split('T')[0],
    impact: log.impact || '',
    relatedPr: log.relatedPr || '',
  };
  showForm.value = true;
};

const handleSubmit = async () => {
  if (editingId.value) {
    await store.updateLog(editingId.value, form.value);
  } else {
    await store.createLog(form.value);
  }
  resetForm();
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this work log?')) {
    await store.deleteLog(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Work Logs</h1>
        <p class="text-sm text-ink-500">Document your technical deliverables, features, and contributions.</p>
      </div>
      <BaseButton @click="showForm = !showForm" class="flex items-center gap-1.5">
        <PlusIcon class="h-5 w-5" />
        <span>{{ showForm ? 'Close Form' : 'New Log' }}</span>
      </BaseButton>
    </div>

    <!-- Quick Add/Edit Form -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showForm" class="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-ink-900 mb-4">
          {{ editingId ? 'Edit Work Log' : 'Create Work Log' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Title</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="e.g. Implement user profile endpoint"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Category</label>
              <select
                v-model="form.category"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Date</label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Related PR Link (Optional)</label>
              <input
                v-model="form.relatedPr"
                type="url"
                placeholder="e.g. https://github.com/org/repo/pull/123"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-ink-700">Description</label>
            <textarea
              v-model="form.description"
              required
              placeholder="What did you build/do?"
              class="w-full min-h-[80px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            ></textarea>
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-ink-700">Business / System Impact (Optional)</label>
            <textarea
              v-model="form.impact"
              placeholder="What is the impact of this work? (e.g. Reduced API response times by 20%)"
              class="w-full min-h-[60px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <BaseButton variant="secondary" type="button" @click="resetForm">Cancel</BaseButton>
            <BaseButton type="submit">{{ editingId ? 'Update Log' : 'Save Log' }}</BaseButton>
          </div>
        </form>
      </div>
    </transition>

    <!-- Filters -->
    <div class="flex items-center gap-3 border-b border-ink-100 pb-4">
      <span class="text-xs font-semibold text-ink-400 uppercase tracking-wider">Filter Category:</span>
      <select
        v-model="filterCategory"
        class="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 focus:border-accent-500 focus:outline-none"
      >
        <option value="ALL">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Listing -->
    <div v-if="store.loading" class="flex min-h-[200px] flex-col items-center justify-center gap-2">
      <ArrowPathIcon class="h-7 w-7 animate-spin text-accent-500" />
      <p class="text-xs text-ink-500 font-medium">Loading logs...</p>
    </div>

    <template v-else>
      <div v-if="filteredLogs.length === 0" class="flex flex-col items-center justify-center py-16 text-center border border-dashed border-ink-150 rounded-xl bg-white p-6">
        <p class="text-sm font-semibold text-ink-650">No work logs found.</p>
        <p class="text-xs text-ink-400 mt-1">Start tracking your work using the button above.</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="group rounded-xl border border-ink-200 bg-white p-5 shadow-sm hover:border-accent-200 transition"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="space-y-1 flex-1 min-w-0">
              <div class="flex items-center flex-wrap gap-2">
                <span
                  class="rounded-full px-2 py-0.5 text-2xs font-bold border"
                  :class="{
                    'bg-red-50 text-red-700 border-red-150': log.category === 'BUG',
                    'bg-green-50 text-green-700 border-green-150': log.category === 'FEATURE',
                    'bg-purple-50 text-purple-700 border-purple-150': log.category === 'IMPROVEMENT',
                    'bg-blue-50 text-blue-700 border-blue-150': log.category === 'RESEARCH' || log.category === 'REFACTOR',
                    'bg-amber-50 text-amber-700 border-amber-150': log.category === 'MEETING' || log.category === 'DISCUSSION',
                    'bg-gray-50 text-gray-700 border-gray-150': log.category === 'DOCUMENTATION' || log.category === 'TESTING',
                  }"
                >
                  {{ log.category }}
                </span>
                <span class="text-xs text-ink-400">{{ new Date(log.date).toLocaleDateString() }}</span>
              </div>
              <h3 class="text-base font-bold text-ink-950">{{ log.title }}</h3>
            </div>
            <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
              <button @click="handleEdit(log)" class="p-1 text-ink-450 hover:text-accent-600 transition">
                <PencilIcon class="h-4.5 w-4.5" />
              </button>
              <button @click="handleDelete(log.id!)" class="p-1 text-ink-450 hover:text-red-500 transition">
                <TrashIcon class="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          <p class="mt-3 text-sm text-ink-700 whitespace-pre-line">{{ log.description }}</p>

          <div v-if="log.impact" class="mt-3 flex gap-2 rounded-lg bg-emerald-50 bg-opacity-50 border border-emerald-100 p-3 text-xs text-emerald-850">
            <span class="font-bold">Impact:</span>
            <span>{{ log.impact }}</span>
          </div>

          <div v-if="log.relatedPr" class="mt-2.5 text-xs flex items-center gap-1.5">
            <span class="text-ink-400">PR:</span>
            <a :href="log.relatedPr" target="_blank" class="text-accent-650 hover:underline truncate">{{ log.relatedPr }}</a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
