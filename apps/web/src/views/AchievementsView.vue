<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAchievementStore } from '@/stores/achievement';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilIcon } from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useAchievementStore();

const showForm = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  situation: '',
  task: '',
  action: '',
  result: '',
  impact: '',
  category: 'DELIVERY' as any,
  date: new Date().toISOString().split('T')[0],
});

const categories = [
  'DELIVERY', 'QUALITY', 'LEADERSHIP', 'COLLABORATION', 'LEARNING', 'IMPACT'
];

onMounted(() => {
  store.fetchAchievements();
});

const resetForm = () => {
  form.value = {
    situation: '',
    task: '',
    action: '',
    result: '',
    impact: '',
    category: 'DELIVERY',
    date: new Date().toISOString().split('T')[0],
  };
  editingId.value = null;
  showForm.value = false;
};

const handleEdit = (item: any) => {
  editingId.value = item.id;
  form.value = {
    situation: item.situation,
    task: item.task,
    action: item.action,
    result: item.result,
    impact: item.impact || '',
    category: item.category,
    date: new Date(item.date).toISOString().split('T')[0],
  };
  showForm.value = true;
};

const handleSubmit = async () => {
  if (editingId.value) {
    await store.updateAchievement(editingId.value, form.value);
  } else {
    await store.createAchievement(form.value);
  }
  resetForm();
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this achievement?')) {
    await store.deleteAchievement(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Achievements (STAR stories)</h1>
        <p class="text-sm text-ink-500">Capture your highlights and success stories for promo packets and reviews.</p>
      </div>
      <BaseButton @click="showForm = !showForm" class="flex items-center gap-1.5">
        <PlusIcon class="h-5 w-5" />
        <span>{{ showForm ? 'Close Form' : 'New Story' }}</span>
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
          {{ editingId ? 'Edit STAR Achievement' : 'Document STAR Achievement' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Category</label>
              <select
                v-model="form.category"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
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
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Situation</label>
              <textarea
                v-model="form.situation"
                required
                placeholder="What was the context or problem you faced?"
                class="w-full min-h-[60px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Task</label>
              <textarea
                v-model="form.task"
                required
                placeholder="What was your responsibility or target?"
                class="w-full min-h-[60px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Action</label>
              <textarea
                v-model="form.action"
                required
                placeholder="What specific actions did you take to resolve it?"
                class="w-full min-h-[60px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Result</label>
              <textarea
                v-model="form.result"
                required
                placeholder="What was the outcome of your actions?"
                class="w-full min-h-[60px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-ink-700">Overall Business / Team Impact (Optional)</label>
            <textarea
              v-model="form.impact"
              placeholder="e.g. Unblocked a team of 5 developers; Shipped project 2 weeks ahead of schedule."
              class="w-full min-h-[60px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <BaseButton variant="secondary" type="button" @click="resetForm">Cancel</BaseButton>
            <BaseButton type="submit">{{ editingId ? 'Update Story' : 'Save Story' }}</BaseButton>
          </div>
        </form>
      </div>
    </transition>

    <!-- Listing -->
    <div v-if="store.loading" class="flex min-h-[200px] flex-col items-center justify-center gap-2">
      <ArrowPathIcon class="h-7 w-7 animate-spin text-accent-500" />
      <p class="text-xs text-ink-500 font-medium">Loading achievements...</p>
    </div>

    <template v-else>
      <div v-if="store.achievements.length === 0" class="flex flex-col items-center justify-center py-16 text-center border border-dashed border-ink-150 rounded-xl bg-white p-6">
        <p class="text-sm font-semibold text-ink-650">No achievements recorded.</p>
        <p class="text-xs text-ink-400 mt-1">Start documenting your growth using the STAR framework.</p>
      </div>

      <div v-else class="space-y-5">
        <div
          v-for="item in store.achievements"
          :key="item.id"
          class="group rounded-xl border border-ink-200 bg-white p-6 shadow-sm hover:border-accent-200 transition"
        >
          <div class="flex justify-between items-start gap-4 border-b border-ink-100 pb-3">
            <div class="space-y-1">
              <div class="flex items-center flex-wrap gap-2">
                <span class="rounded bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 text-2xs font-bold">
                  {{ item.category }}
                </span>
                <span class="text-xs text-ink-450">{{ new Date(item.date).toLocaleDateString() }}</span>
              </div>
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

          <!-- STAR layout display -->
          <div class="mt-4 grid gap-4 sm:grid-cols-4 text-sm">
            <div class="space-y-1">
              <h4 class="font-bold text-ink-800 text-xs uppercase tracking-wider">Situation</h4>
              <p class="text-ink-700">{{ item.situation }}</p>
            </div>
            <div class="space-y-1 border-t border-ink-100 pt-2 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4">
              <h4 class="font-bold text-ink-800 text-xs uppercase tracking-wider">Task</h4>
              <p class="text-ink-700">{{ item.task }}</p>
            </div>
            <div class="space-y-1 border-t border-ink-100 pt-2 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4">
              <h4 class="font-bold text-ink-800 text-xs uppercase tracking-wider">Action</h4>
              <p class="text-ink-700">{{ item.action }}</p>
            </div>
            <div class="space-y-1 border-t border-ink-100 pt-2 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4">
              <h4 class="font-bold text-ink-800 text-xs uppercase tracking-wider">Result</h4>
              <p class="text-ink-700">{{ item.result }}</p>
            </div>
          </div>

          <div v-if="item.impact" class="mt-4 flex gap-2 rounded-lg bg-emerald-50 bg-opacity-60 border border-emerald-100 p-3 text-xs text-emerald-800">
            <span class="font-bold">STAR Impact:</span>
            <span>{{ item.impact }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
