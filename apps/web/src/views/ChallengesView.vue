<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useChallengeStore } from '@/stores/challenge';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilIcon } from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useChallengeStore();

const showForm = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  problem: '',
  rootCause: '',
  solution: '',
  result: '',
  lessonsLearned: '',
  date: new Date().toISOString().split('T')[0],
});

onMounted(() => {
  store.fetchChallenges();
});

const resetForm = () => {
  form.value = {
    problem: '',
    rootCause: '',
    solution: '',
    result: '',
    lessonsLearned: '',
    date: new Date().toISOString().split('T')[0],
  };
  editingId.value = null;
  showForm.value = false;
};

const handleEdit = (item: any) => {
  editingId.value = item.id;
  form.value = {
    problem: item.problem,
    rootCause: item.rootCause || '',
    solution: item.solution || '',
    result: item.result || '',
    lessonsLearned: item.lessonsLearned || '',
    date: new Date(item.date).toISOString().split('T')[0],
  };
  showForm.value = true;
};

const handleSubmit = async () => {
  if (editingId.value) {
    await store.updateChallenge(editingId.value, form.value);
  } else {
    await store.createChallenge(form.value);
  }
  resetForm();
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this challenge log?')) {
    await store.deleteChallenge(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Challenges & Roadblocks</h1>
        <p class="text-sm text-ink-500">Log technical issues, debug sessions, root causes, and lessons learned.</p>
      </div>
      <BaseButton @click="showForm = !showForm" class="flex items-center gap-1.5">
        <PlusIcon class="h-5 w-5" />
        <span>{{ showForm ? 'Close Form' : 'New Challenge' }}</span>
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
          {{ editingId ? 'Edit Challenge' : 'Log New Challenge' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Problem Description</label>
              <textarea
                v-model="form.problem"
                required
                placeholder="What roadblock or issue did you run into?"
                class="w-full min-h-[70px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Root Cause Analysis</label>
              <textarea
                v-model="form.rootCause"
                placeholder="Why did this problem occur? What did your investigation find?"
                class="w-full min-h-[70px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Proposed / Implemented Solution</label>
              <textarea
                v-model="form.solution"
                placeholder="How did you resolve it? What was the fix?"
                class="w-full min-h-[70px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Result & Outcome</label>
              <textarea
                v-model="form.result"
                placeholder="What was the result after implementing the solution?"
                class="w-full min-h-[70px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Lessons Learned</label>
              <textarea
                v-model="form.lessonsLearned"
                placeholder="What will you do differently next time? Any architectural take-aways?"
                class="w-full min-h-[60px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Date Logged</label>
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <BaseButton variant="secondary" type="button" @click="resetForm">Cancel</BaseButton>
            <BaseButton type="submit">{{ editingId ? 'Update Challenge' : 'Save Challenge' }}</BaseButton>
          </div>
        </form>
      </div>
    </transition>

    <!-- Listing -->
    <div v-if="store.loading" class="flex min-h-[200px] flex-col items-center justify-center gap-2">
      <ArrowPathIcon class="h-7 w-7 animate-spin text-accent-500" />
      <p class="text-xs text-ink-500 font-medium">Loading challenges...</p>
    </div>

    <template v-else>
      <div v-if="store.challenges.length === 0" class="flex flex-col items-center justify-center py-16 text-center border border-dashed border-ink-150 rounded-xl bg-white p-6">
        <p class="text-sm font-semibold text-ink-650">No challenges logged.</p>
        <p class="text-xs text-ink-400 mt-1">Log complex bugs and design decisions to showcase problem solving skills.</p>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="item in store.challenges"
          :key="item.id"
          class="group rounded-xl border border-ink-200 bg-white p-6 shadow-sm hover:border-accent-200 transition"
        >
          <div class="flex justify-between items-center border-b border-ink-100 pb-3">
            <span class="text-xs font-semibold text-ink-450">{{ new Date(item.date).toLocaleDateString() }}</span>
            <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
              <button @click="handleEdit(item)" class="p-1 text-ink-450 hover:text-accent-600 transition">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="handleDelete(item.id!)" class="p-1 text-ink-450 hover:text-red-500 transition">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="mt-4 space-y-3.5 text-sm">
            <div>
              <h4 class="font-bold text-red-700 text-xs uppercase tracking-wider">Problem</h4>
              <p class="text-ink-900 mt-0.5">{{ item.problem }}</p>
            </div>
            <div v-if="item.rootCause" class="border-t border-ink-100 pt-2">
              <h4 class="font-bold text-ink-850 text-xs uppercase tracking-wider">Root Cause</h4>
              <p class="text-ink-700 mt-0.5">{{ item.rootCause }}</p>
            </div>
            <div v-if="item.solution" class="border-t border-ink-100 pt-2">
              <h4 class="font-bold text-ink-850 text-xs uppercase tracking-wider">Solution</h4>
              <p class="text-ink-700 mt-0.5">{{ item.solution }}</p>
            </div>
            <div v-if="item.result" class="border-t border-ink-100 pt-2">
              <h4 class="font-bold text-ink-850 text-xs uppercase tracking-wider">Result</h4>
              <p class="text-ink-700 mt-0.5">{{ item.result }}</p>
            </div>
            <div v-if="item.lessonsLearned" class="border-t border-emerald-100 bg-emerald-50 bg-opacity-40 p-3 rounded-lg mt-3">
              <h4 class="font-bold text-emerald-800 text-xs uppercase tracking-wider">Lessons Learned</h4>
              <p class="text-emerald-950 mt-0.5">{{ item.lessonsLearned }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
