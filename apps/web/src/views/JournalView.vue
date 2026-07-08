<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useJournalStore } from '@/stores/journal';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useJournalStore();

// Local form states for the journal
const reflection = ref('');
const summary = ref('');
const notes = ref('');

// Task creation states
const newTaskTitle = ref('');
const newTaskPriority = ref<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
const newTaskDueDate = ref('');
const showCreateModal = ref(false);

const rolloverInfo = ref<string | null>(null);

const expandedTasks = ref<Record<string, boolean>>({});
const toggleTaskExpand = (id: string) => {
  expandedTasks.value[id] = !expandedTasks.value[id];
};

// Get local date string YYYY-MM-DD
const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isToday = computed(() => store.selectedDate === getLocalDateString());

async function loadData() {
  await store.fetchDayData();
  
  // Set local fields
  reflection.value = store.journal?.reflection || '';
  summary.value = store.journal?.summary || '';
  notes.value = store.journal?.notes || '';

  // Trigger auto-rollover if it's today
  if (isToday.value) {
    const rolled = await store.triggerRollover();
    if (rolled > 0) {
      rolloverInfo.value = `Auto-rolled over ${rolled} incomplete task${rolled > 1 ? 's' : ''} from previous active day.`;
      setTimeout(() => {
        rolloverInfo.value = null;
      }, 5000);
    }
  }
}

// Watch selectedDate to reload
watch(() => store.selectedDate, () => {
  loadData();
});

onMounted(() => {
  loadData();
});

// Debounced autosave for Journal
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const handleJournalInput = () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    store.saveJournal(reflection.value, summary.value, notes.value);
  }, 1000);
};

// Date navigation
const prevDay = () => {
  const current = new Date(store.selectedDate);
  current.setDate(current.getDate() - 1);
  store.setSelectedDate(getLocalDateString(current));
};

const nextDay = () => {
  const current = new Date(store.selectedDate);
  current.setDate(current.getDate() + 1);
  store.setSelectedDate(getLocalDateString(current));
};

const setToday = () => {
  store.setSelectedDate(getLocalDateString());
};

// Tasks actions
const handleCreateTask = async () => {
  if (!newTaskTitle.value.trim()) return;
  await store.createTask(
    newTaskTitle.value.trim(),
    newTaskPriority.value,
    newTaskDueDate.value || undefined
  );
  newTaskTitle.value = '';
  newTaskDueDate.value = '';
  showCreateModal.value = false;
};

const handleToggleTask = (id: string, completed: boolean) => {
  store.toggleTask(id, completed);
};

const handleUpdatePriority = (id: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') => {
  store.updateTaskPriority(id, priority);
};

const handleDeleteTask = (id: string) => {
  store.deleteTask(id);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Date Selection -->
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Daily Journal & Tasks</h1>
        <p class="text-sm text-ink-500">Write reflections and organize tasks for the day.</p>
      </div>

      <!-- Date Navigator -->
      <div class="flex flex-wrap items-center gap-2">
        <BaseButton variant="secondary" class="h-9 px-2" @click="prevDay">
          <ChevronLeftIcon class="h-4 w-4" />
        </BaseButton>
        
        <input
          v-model="store.selectedDate"
          type="date"
          class="h-9 rounded-md border border-ink-200 bg-white px-3 text-sm font-medium text-ink-800 shadow-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
        />

        <BaseButton variant="secondary" class="h-9 px-2" @click="nextDay">
          <ChevronRightIcon class="h-4 w-4" />
        </BaseButton>

        <BaseButton variant="secondary" class="h-9" @click="setToday">
          Today
        </BaseButton>
      </div>
    </div>

    <!-- Rollover Info Banner -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="rolloverInfo"
        class="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 shadow-sm"
      >
        <CheckIcon class="h-5 w-5 flex-shrink-0 text-blue-500" />
        <span class="font-medium">{{ rolloverInfo }}</span>
      </div>
    </transition>

    <!-- Main Content Split Layout -->
    <div class="grid gap-6 lg:grid-cols-12">
      <!-- Loading State -->
      <div v-if="store.loading" class="col-span-12 flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-ink-150 bg-white p-8">
        <ArrowPathIcon class="h-8 w-8 animate-spin text-accent-500" />
        <p class="text-sm font-medium text-ink-500">Loading daily details...</p>
      </div>

      <template v-else>
        <!-- Left: Journal Editor (7 cols) -->
        <section class="lg:col-span-7 space-y-4">
          <div class="rounded-xl border border-ink-200 bg-white p-5 shadow-sm space-y-5">
            <div class="flex items-center justify-between border-b border-ink-100 pb-3">
              <h2 class="text-lg font-semibold text-ink-950">Daily Journal</h2>
              <span class="text-xs font-medium text-ink-400">
                <span v-if="store.saving" class="flex items-center gap-1">
                  <ArrowPathIcon class="h-3 w-3 animate-spin text-ink-400" /> Saving...
                </span>
                <span v-else class="flex items-center gap-0.5">
                  <CheckIcon class="h-3.5 w-3.5 text-emerald-500" /> Saved
                </span>
              </span>
            </div>

            <!-- Reflection -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-ink-800">Reflection</label>
              <textarea
                v-model="reflection"
                @input="handleJournalInput"
                placeholder="What went well today? What could be improved?"
                class="w-full min-h-[120px] rounded-lg border border-ink-250 bg-white p-3 text-sm placeholder:text-ink-350 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>

            <!-- Summary -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-ink-800">Daily Summary</label>
              <textarea
                v-model="summary"
                @input="handleJournalInput"
                placeholder="Brief summary of your achievements and work done."
                class="w-full min-h-[80px] rounded-lg border border-ink-250 bg-white p-3 text-sm placeholder:text-ink-350 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>

            <!-- Notes -->
            <div class="space-y-1.5">
              <label class="text-sm font-semibold text-ink-800">General Notes</label>
              <textarea
                v-model="notes"
                @input="handleJournalInput"
                placeholder="Miscellaneous notes, scratchpad, ideas..."
                class="w-full min-h-[100px] rounded-lg border border-ink-250 bg-white p-3 text-sm placeholder:text-ink-350 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
              ></textarea>
            </div>
          </div>
        </section>

        <!-- Right: Task List (5 cols) -->
        <section class="lg:col-span-5 space-y-4">
          <div class="rounded-xl border border-ink-200 bg-white p-5 shadow-sm space-y-5">
            <div class="flex items-center justify-between border-b border-ink-100 pb-3">
              <h2 class="text-lg font-semibold text-ink-950">Tasks</h2>
              <button
                type="button"
                @click="showCreateModal = true"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-500 hover:border-accent-500 hover:text-accent-600 hover:shadow-sm transition"
              >
                <PlusIcon class="h-5 w-5" />
              </button>
            </div>

            <!-- Tasks Listing -->
            <div class="space-y-2">
              <div v-if="store.tasks.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
                <p class="text-sm font-medium text-ink-500">No tasks for today.</p>
                <p class="text-xs text-ink-400 mt-1">Get started by creating one above!</p>
              </div>

              <div
                v-for="task in store.tasks"
                :key="task.id"
                class="group flex items-center justify-between gap-3 rounded-lg border border-ink-100 bg-ink-50/50 p-3 hover:bg-ink-100/50 transition"
              >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <!-- Checkbox -->
                  <input
                    type="checkbox"
                    :checked="task.completed"
                    @change="handleToggleTask(task.id, ($event.target as HTMLInputElement).checked)"
                    class="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
                  />
                  <!-- Task Title -->
                  <span
                    @click="toggleTaskExpand(task.id)"
                    class="text-sm min-w-0 text-ink-900 cursor-pointer"
                    :class="{
                      'truncate': !expandedTasks[task.id],
                      'whitespace-normal break-all': expandedTasks[task.id],
                      'line-through text-ink-400': task.completed
                    }"
                    :title="task.title"
                  >
                    {{ task.title }}
                  </span>
                </div>

                <!-- Priority Badge and Delete -->
                <div class="flex items-center gap-2">
                  <select
                    :value="task.priority"
                    @change="handleUpdatePriority(task.id, ($event.target as HTMLSelectElement).value as any)"
                    class="text-xs font-medium rounded-full px-2 py-0.5 border border-transparent bg-opacity-10 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-500"
                    :class="{
                      'bg-gray-100 text-gray-700 border-gray-255': task.priority === 'LOW',
                      'bg-blue-100 text-blue-700 border-blue-255': task.priority === 'MEDIUM',
                      'bg-orange-100 text-orange-700 border-orange-255': task.priority === 'HIGH',
                      'bg-red-100 text-red-700 border-red-255': task.priority === 'URGENT',
                    }"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>

                  <!-- Delete Button -->
                  <button
                    type="button"
                    @click="handleDeleteTask(task.id)"
                    class="text-ink-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition p-1"
                  >
                    <TrashIcon class="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>

    <!-- Create Task Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-xl border border-ink-200 shadow-xl w-full max-w-md p-6 space-y-4">
          <div class="flex justify-between items-center border-b border-ink-100 pb-3">
            <h3 class="text-base font-bold text-ink-950">Create New Task</h3>
            <button @click="showCreateModal = false" class="text-ink-400 hover:text-ink-600 transition">
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
          
          <form @submit.prevent="handleCreateTask" class="space-y-4">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-ink-700">Task Title</label>
              <input
                v-model="newTaskTitle"
                type="text"
                required
                placeholder="What needs to be done?"
                class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
              />
            </div>

            <div class="grid gap-4 grid-cols-2">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-ink-700">Priority</label>
                <select
                  v-model="newTaskPriority"
                  class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm text-ink-750 focus:border-accent-500 focus:outline-none"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-semibold text-ink-700">Due Date (Optional)</label>
                <input
                  v-model="newTaskDueDate"
                  type="date"
                  class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm text-ink-750 focus:border-accent-500 focus:outline-none"
                />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <BaseButton variant="secondary" type="button" @click="showCreateModal = false">Cancel</BaseButton>
              <BaseButton type="submit">Create Task</BaseButton>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>
