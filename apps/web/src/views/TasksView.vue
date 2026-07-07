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
  FunnelIcon,
} from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useJournalStore();

// Task creation states
const newTaskTitle = ref('');
const newTaskPriority = ref<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
const newTaskDueDate = ref('');

// Filter states
const filterStatus = ref<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
const filterPriority = ref<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('ALL');

const rolloverInfo = ref<string | null>(null);

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

watch(() => store.selectedDate, () => {
  loadData();
});

onMounted(() => {
  loadData();
});

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

// Filtered tasks
const filteredTasks = computed(() => {
  return store.tasks.filter((task) => {
    const matchStatus =
      filterStatus.value === 'ALL' ||
      (filterStatus.value === 'COMPLETED' && task.completed) ||
      (filterStatus.value === 'ACTIVE' && !task.completed);
    
    const matchPriority =
      filterPriority.value === 'ALL' || task.priority === filterPriority.value;

    return matchStatus && matchPriority;
  });
});

const completionStats = computed(() => {
  const total = store.tasks.length;
  const completed = store.tasks.filter((t) => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
});

// Tasks actions
const handleCreateTask = async () => {
  if (!newTaskTitle.value.trim()) return;
  await store.createTask(
    newTaskTitle.value.trim(),
    newTaskPriority.value,
    newTaskDueDate.value || null
  );
  newTaskTitle.value = '';
  newTaskDueDate.value = '';
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

const expandedTasks = ref<Record<string, boolean>>({});
const toggleTaskExpand = (id: string) => {
  expandedTasks.value[id] = !expandedTasks.value[id];
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Date Selection -->
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="text-2xl font-bold text-ink-900">Tasks</h1>
        <p class="text-sm text-ink-500">Manage and organize your daily work assignments.</p>
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

    <!-- Content Card -->
    <div class="rounded-xl border border-ink-200 bg-white p-6 shadow-sm space-y-6">
      
      <!-- Progress Bar -->
      <div v-if="completionStats.total > 0" class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="font-medium text-ink-700">Daily Completion</span>
          <span class="font-semibold text-accent-700">
            {{ completionStats.completed }} of {{ completionStats.total }} tasks ({{ completionStats.percent }}%)
          </span>
        </div>
        <div class="h-2 w-full rounded-full bg-ink-100 overflow-hidden">
          <div
            class="h-full bg-accent-600 transition-all duration-500"
            :style="{ width: `${completionStats.percent}%` }"
          ></div>
        </div>
      </div>

      <!-- Quick Add Task Form -->
      <form @submit.prevent="handleCreateTask" class="flex flex-col gap-3 sm:flex-row">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="What needs to be done?"
          class="flex-1 rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm placeholder:text-ink-350 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
        />
        <div class="flex gap-2">
          <select
            v-model="newTaskPriority"
            class="rounded-lg border border-ink-250 bg-white px-2 py-2 text-sm text-ink-700 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="URGENT">Urgent Priority</option>
          </select>
          <input
            v-model="newTaskDueDate"
            type="date"
            class="rounded-lg border border-ink-250 bg-white px-2 py-2 text-sm text-ink-700 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            placeholder="Due Date"
          />
          <button
            type="submit"
            class="inline-flex h-10 px-4 items-center justify-center gap-1.5 rounded-lg bg-accent-600 text-white hover:bg-accent-500 transition font-medium text-sm"
          >
            <PlusIcon class="h-5 w-5" />
            <span>Add</span>
          </button>
        </div>
      </form>

      <!-- Filters & Sorting Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-t border-b border-ink-100 py-3">
        <div class="flex flex-wrap items-center gap-3">
          <span class="flex items-center gap-1 text-xs font-semibold text-ink-500 uppercase tracking-wider">
            <FunnelIcon class="h-3.5 w-3.5" /> Filters:
          </span>
          <!-- Status Filters -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              v-for="status in ['ALL', 'ACTIVE', 'COMPLETED']"
              :key="status"
              type="button"
              @click="filterStatus = status as any"
              class="px-3 py-1 text-xs font-medium border border-ink-200 first:rounded-l-md last:rounded-r-md -ml-px hover:bg-ink-50 transition"
              :class="filterStatus === status ? 'bg-ink-100 text-ink-900 border-ink-300 font-semibold' : 'bg-white text-ink-600'"
            >
              {{ status.charAt(0) + status.slice(1).toLowerCase() }}
            </button>
          </div>

          <!-- Priority Filters -->
          <select
            v-model="filterPriority"
            class="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs font-medium text-ink-650 focus:border-accent-500 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="flex min-h-[200px] flex-col items-center justify-center gap-2">
        <ArrowPathIcon class="h-7 w-7 animate-spin text-accent-500" />
        <p class="text-xs text-ink-500 font-medium">Loading tasks...</p>
      </div>

      <template v-else>
        <!-- Tasks list -->
        <div class="space-y-2">
          <div v-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center py-12 text-center border border-dashed border-ink-150 rounded-xl">
            <p class="text-sm font-semibold text-ink-600">No tasks found matching filter criteria.</p>
            <p class="text-xs text-ink-400 mt-1">Try changing filters or add a new task above.</p>
          </div>

          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="group flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-ink-50/40 p-4 hover:bg-ink-100/40 transition"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <!-- Checkbox -->
              <input
                type="checkbox"
                :checked="task.completed"
                @change="handleToggleTask(task.id, ($event.target as HTMLInputElement).checked)"
                class="h-5 w-5 rounded border-ink-300 text-accent-600 focus:ring-accent-500 cursor-pointer"
              />
              <!-- Task Title & Due Date -->
              <div class="min-w-0 flex-1">
                <p
                  @click="toggleTaskExpand(task.id)"
                  class="text-sm font-medium text-ink-900 cursor-pointer"
                  :class="{
                    'truncate': !expandedTasks[task.id],
                    'whitespace-normal break-all': expandedTasks[task.id],
                    'line-through text-ink-400': task.completed
                  }"
                  :title="task.title"
                >
                  {{ task.title }}
                </p>
                <p v-if="task.dueDate" class="text-xs text-ink-450 mt-0.5">
                  Due: {{ new Date(task.dueDate).toLocaleDateString() }}
                </p>
              </div>
            </div>

            <!-- Badges and delete action -->
            <div class="flex items-center gap-3">
              <!-- Priority badge -->
              <select
                :value="task.priority"
                @change="handleUpdatePriority(task.id, ($event.target as HTMLSelectElement).value as any)"
                class="text-xs font-semibold rounded-full px-2.5 py-1 border border-transparent bg-opacity-10 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-500"
                :class="{
                  'bg-gray-155 text-gray-700 border-gray-250': task.priority === 'LOW',
                  'bg-blue-155 text-blue-700 border-blue-250': task.priority === 'MEDIUM',
                  'bg-orange-155 text-orange-700 border-orange-255': task.priority === 'HIGH',
                  'bg-red-155 text-red-700 border-red-255': task.priority === 'URGENT',
                }"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              <!-- Delete task button -->
              <button
                type="button"
                @click="handleDeleteTask(task.id)"
                class="text-ink-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition p-1.5"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
