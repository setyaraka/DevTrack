<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFeedbackStore } from '@/stores/feedback';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/vue/24/solid';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useFeedbackStore();

const showForm = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  reviewer: '',
  feedback: '',
  category: 'CODE_REVIEW' as any,
  applied: false,
  date: new Date().toISOString().split('T')[0],
});

const categories = [
  'CODE_REVIEW', 'DESIGN', 'COMMUNICATION', 'PROCESS', 'TECHNICAL', 'LEADERSHIP', 'OTHER'
];

onMounted(() => {
  store.fetchFeedbacks();
});

const resetForm = () => {
  form.value = {
    reviewer: '',
    feedback: '',
    category: 'CODE_REVIEW',
    applied: false,
    date: new Date().toISOString().split('T')[0],
  };
  editingId.value = null;
  showForm.value = false;
};

const handleEdit = (item: any) => {
  editingId.value = item.id;
  form.value = {
    reviewer: item.reviewer,
    feedback: item.feedback,
    category: item.category,
    applied: item.applied,
    date: new Date(item.date).toISOString().split('T')[0],
  };
  showForm.value = true;
};

const handleSubmit = async () => {
  if (editingId.value) {
    await store.updateFeedback(editingId.value, form.value);
  } else {
    await store.createFeedback(form.value);
  }
  resetForm();
};

const handleToggleApplied = async (item: any) => {
  await store.updateFeedback(item.id, { applied: !item.applied });
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this feedback?')) {
    await store.deleteFeedback(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Feedback Tracker</h1>
        <p class="text-sm text-ink-500">Collect, track, and apply constructive feedback from peers and managers.</p>
      </div>
      <BaseButton @click="showForm = !showForm" class="flex items-center gap-1.5">
        <PlusIcon class="h-5 w-5" />
        <span>{{ showForm ? 'Close Form' : 'New Feedback' }}</span>
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
          {{ editingId ? 'Edit Feedback' : 'Record Feedback' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Reviewer / Giver</label>
              <input
                v-model="form.reviewer"
                type="text"
                required
                placeholder="e.g. John Doe (Tech Lead)"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Category</label>
              <select
                v-model="form.category"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat.replace('_', ' ') }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Date Received</label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-ink-700">Feedback Description</label>
            <textarea
              v-model="form.feedback"
              required
              placeholder="What constructive notes or suggestions did they provide?"
              class="w-full min-h-[80px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            ></textarea>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="applied"
              v-model="form.applied"
              type="checkbox"
              class="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500 cursor-pointer"
            />
            <label for="applied" class="text-sm text-ink-700 cursor-pointer">I have applied this feedback to my work</label>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <BaseButton variant="secondary" type="button" @click="resetForm">Cancel</BaseButton>
            <BaseButton type="submit">{{ editingId ? 'Update Feedback' : 'Save Feedback' }}</BaseButton>
          </div>
        </form>
      </div>
    </transition>

    <!-- Listing -->
    <div v-if="store.loading" class="flex min-h-[200px] flex-col items-center justify-center gap-2">
      <ArrowPathIcon class="h-7 w-7 animate-spin text-accent-500" />
      <p class="text-xs text-ink-500 font-medium">Loading feedback...</p>
    </div>

    <template v-else>
      <div v-if="store.feedbacks.length === 0" class="flex flex-col items-center justify-center py-16 text-center border border-dashed border-ink-150 rounded-xl bg-white p-6">
        <p class="text-sm font-semibold text-ink-650">No feedback logs found.</p>
        <p class="text-xs text-ink-400 mt-1">Record feedback you receive to track professional alignment.</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in store.feedbacks"
          :key="item.id"
          class="group rounded-xl border border-ink-200 bg-white p-5 shadow-sm hover:border-accent-200 transition"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="space-y-1">
              <div class="flex items-center flex-wrap gap-2">
                <span class="rounded bg-accent-50 border border-accent-100 text-accent-700 px-2 py-0.5 text-2xs font-bold uppercase tracking-wider">
                  {{ item.category.replace('_', ' ') }}
                </span>
                <span class="text-xs text-ink-450">{{ new Date(item.date).toLocaleDateString() }}</span>
                <button
                  type="button"
                  @click="handleToggleApplied(item)"
                  class="flex items-center gap-1 rounded px-2 py-0.5 text-2xs font-semibold transition"
                  :class="item.applied ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-ink-100 border border-ink-200 text-ink-600'"
                >
                  <component :is="item.applied ? CheckCircleIconSolid : CheckCircleIcon" class="h-3.5 w-3.5" />
                  <span>{{ item.applied ? 'Applied' : 'Pending' }}</span>
                </button>
              </div>
              <h3 class="text-base font-bold text-ink-950 mt-1">From: {{ item.reviewer }}</h3>
            </div>

            <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
              <button @click="handleEdit(item)" class="p-1 text-ink-450 hover:text-accent-600 transition">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="handleDelete(item.id!)" class="p-1 text-ink-450 hover:text-red-500 transition">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <p class="mt-3 text-sm text-ink-700 whitespace-pre-line border-l-2 border-ink-250 pl-3 italic">
            "{{ item.feedback }}"
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
