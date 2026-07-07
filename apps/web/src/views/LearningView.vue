<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLearningStore } from '@/stores/learning';
import { PlusIcon, TrashIcon, ArrowPathIcon, PencilIcon, StarIcon } from '@heroicons/vue/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useLearningStore();

const showForm = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  topic: '',
  description: '',
  understandingLevel: 3,
  tagsInput: '',
});

onMounted(() => {
  store.fetchLearnings();
});

const resetForm = () => {
  form.value = {
    topic: '',
    description: '',
    understandingLevel: 3,
    tagsInput: '',
  };
  editingId.value = null;
  showForm.value = false;
};

const handleEdit = (item: any) => {
  editingId.value = item.id;
  form.value = {
    topic: item.topic,
    description: item.description || '',
    understandingLevel: item.understandingLevel,
    tagsInput: item.tags.join(', '),
  };
  showForm.value = true;
};

const handleSubmit = async () => {
  const tags = form.value.tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const payload = {
    topic: form.value.topic,
    description: form.value.description,
    understandingLevel: form.value.understandingLevel,
    tags,
  };

  if (editingId.value) {
    await store.updateLearning(editingId.value, payload);
  } else {
    await store.createLearning(payload);
  }
  resetForm();
};

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this learning record?')) {
    await store.deleteLearning(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Learning Tracker</h1>
        <p class="text-sm text-ink-500">Track skills, technologies, and topics you are mastering.</p>
      </div>
      <BaseButton @click="showForm = !showForm" class="flex items-center gap-1.5">
        <PlusIcon class="h-5 w-5" />
        <span>{{ showForm ? 'Close Form' : 'New Skill' }}</span>
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
          {{ editingId ? 'Edit Learning Record' : 'Track New Skill / Topic' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Topic / Technology</label>
              <input
                v-model="form.topic"
                type="text"
                required
                placeholder="e.g. NestJS Microservices, Vue 3 Composition API"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Tags (comma separated)</label>
              <input
                v-model="form.tagsInput"
                type="text"
                placeholder="e.g. backend, nodejs, architecture"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              />
            </div>
          </div>
          
          <div class="space-y-1">
            <label class="text-xs font-semibold text-ink-700">Description / Key Notes</label>
            <textarea
              v-model="form.description"
              placeholder="What did you learn? Key insights, links, resources..."
              class="w-full min-h-[80px] rounded-lg border border-ink-250 bg-white p-3 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            ></textarea>
          </div>

          <!-- Rating -->
          <div class="space-y-1">
            <label class="text-xs font-semibold text-ink-700 block">Understanding Level (1-5)</label>
            <div class="flex items-center gap-1.5 mt-1">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="form.understandingLevel = star"
                class="text-amber-400 hover:scale-110 transition p-0.5"
              >
                <StarIconSolid v-if="star <= form.understandingLevel" class="h-6 w-6" />
                <StarIcon v-else class="h-6 w-6 text-ink-300" />
              </button>
              <span class="text-xs font-medium text-ink-500 ml-2">
                Level {{ form.understandingLevel }} of 5
              </span>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <BaseButton variant="secondary" type="button" @click="resetForm">Cancel</BaseButton>
            <BaseButton type="submit">{{ editingId ? 'Update Record' : 'Save Record' }}</BaseButton>
          </div>
        </form>
      </div>
    </transition>

    <!-- Listing -->
    <div v-if="store.loading" class="flex min-h-[200px] flex-col items-center justify-center gap-2">
      <ArrowPathIcon class="h-7 w-7 animate-spin text-accent-500" />
      <p class="text-xs text-ink-500 font-medium">Loading skills...</p>
    </div>

    <template v-else>
      <div v-if="store.learnings.length === 0" class="flex flex-col items-center justify-center py-16 text-center border border-dashed border-ink-150 rounded-xl bg-white p-6">
        <p class="text-sm font-semibold text-ink-650">No learning logs found.</p>
        <p class="text-xs text-ink-400 mt-1">Track what you learn to build your engineering portfolio.</p>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="item in store.learnings"
          :key="item.id"
          class="group rounded-xl border border-ink-200 bg-white p-5 shadow-sm hover:border-accent-200 transition flex flex-col justify-between"
        >
          <div>
            <div class="flex justify-between items-start gap-4">
              <h3 class="text-base font-bold text-ink-950 flex-1 min-w-0">{{ item.topic }}</h3>
              <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                <button @click="handleEdit(item)" class="p-1 text-ink-450 hover:text-accent-600 transition">
                  <PencilIcon class="h-4 w-4" />
                </button>
                <button @click="handleDelete(item.id!)" class="p-1 text-ink-450 hover:text-red-500 transition">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Understanding stars -->
            <div class="flex items-center gap-0.5 mt-1">
              <StarIconSolid v-for="star in item.understandingLevel" :key="star" class="h-4 w-4 text-amber-400" />
              <StarIcon v-for="star in (5 - item.understandingLevel)" :key="star" class="h-4 w-4 text-ink-250" />
            </div>

            <p class="mt-3 text-sm text-ink-700 whitespace-pre-line">{{ item.description }}</p>
          </div>

          <!-- Tags -->
          <div v-if="item.tags && item.tags.length > 0" class="mt-4 flex flex-wrap gap-1">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="rounded bg-ink-50 px-2 py-0.5 text-2xs font-medium text-ink-600 border border-ink-100"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
