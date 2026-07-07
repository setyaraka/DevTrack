<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import {
  UserIcon,
  PaintBrushIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useSettingsStore();
const authStore = useAuthStore();
const router = useRouter();

const activeTab = ref<'profile' | 'appearance' | 'work' | 'account'>('profile');

// Forms state
const profileForm = ref({
  avatarUrl: '',
  name: '',
  email: '',
  company: '',
  jobTitle: '',
  timezone: 'UTC',
});

const appearanceForm = ref({
  theme: 'SYSTEM' as any,
  sidebarMode: 'EXPANDED' as any,
});

const workForm = ref({
  workingDays: [] as string[],
  autoTaskRollover: false,
  rolloverTime: '00:00',
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const passwordError = ref('');

const loadFormsData = () => {
  if (store.settings) {
    profileForm.value = { ...store.settings.profile };
    appearanceForm.value = { ...store.settings.appearance };
    workForm.value = { ...store.settings.workPreferences };
  }
};

onMounted(async () => {
  await store.fetchSettings();
  loadFormsData();
});

const handleAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    profileForm.value.avatarUrl = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const handleSaveProfile = async () => {
  await store.updateProfile(profileForm.value);
};

const handleResetProfile = () => {
  if (store.settings) {
    profileForm.value = { ...store.settings.profile };
  }
};

const handleSaveAppearance = async () => {
  await store.updateAppearance(appearanceForm.value);
};

const handleSaveWork = async () => {
  await store.updateWorkPreferences(workForm.value);
};

const handleUpdatePassword = async () => {
  passwordError.value = '';
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New password confirmation does not match.';
    return;
  }
  try {
    await store.updatePassword(passwordForm.value);
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  } catch (err: any) {
    passwordError.value = err.response?.data?.message || 'Failed to update password.';
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/auth/login');
};

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Success Toast -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="store.successMessage"
        class="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-3 shadow-lg"
      >
        <CheckCircleIcon class="h-5 w-5" />
        <span class="text-sm font-semibold">{{ store.successMessage }}</span>
      </div>
    </transition>

    <div>
      <h1 class="text-2xl font-bold text-ink-900">Settings</h1>
      <p class="text-sm text-ink-500">Configure your personal preferences, integrations, and work behaviors.</p>
    </div>

    <!-- Main Container -->
    <div class="flex flex-col md:flex-row gap-6">
      
      <!-- Submenu / Sidebar tabs -->
      <aside class="md:w-64 flex flex-row md:flex-col gap-1 border-b md:border-b-0 md:border-r border-ink-200 pb-4 md:pb-0 md:pr-6 overflow-x-auto">
        <button
          @click="activeTab = 'profile'"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap"
          :class="activeTab === 'profile' ? 'bg-ink-100 text-ink-900 font-bold' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'"
        >
          <UserIcon class="h-4 w-4" />
          <span>Profile</span>
        </button>

        <button
          @click="activeTab = 'appearance'"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap"
          :class="activeTab === 'appearance' ? 'bg-ink-100 text-ink-900 font-bold' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'"
        >
          <PaintBrushIcon class="h-4 w-4" />
          <span>Appearance</span>
        </button>

        <button
          @click="activeTab = 'work'"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap"
          :class="activeTab === 'work' ? 'bg-ink-100 text-ink-900 font-bold' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'"
        >
          <BriefcaseIcon class="h-4 w-4" />
          <span>Work Preferences</span>
        </button>

        <button
          @click="activeTab = 'account'"
          class="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap"
          :class="activeTab === 'account' ? 'bg-ink-100 text-ink-900 font-bold' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'"
        >
          <ShieldCheckIcon class="h-4 w-4" />
          <span>Account</span>
        </button>
      </aside>

      <!-- Content Area -->
      <div class="flex-1 min-w-0">
        <div v-if="store.loading && !store.settings" class="flex min-h-[300px] flex-col items-center justify-center gap-2">
          <ArrowPathIcon class="h-8 w-8 animate-spin text-accent-500" />
          <p class="text-sm text-ink-500 font-medium">Loading preferences...</p>
        </div>

        <template v-else>
          <!-- Profile Settings -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <div class="bg-white rounded-xl border border-ink-200 p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-semibold text-ink-900 border-b border-ink-100 pb-3">Profile Information</h2>
              
              <!-- Avatar Upload -->
              <div class="flex items-center gap-4">
                <div class="relative h-16 w-16 rounded-full overflow-hidden border border-ink-200 bg-ink-50">
                  <img
                    v-if="profileForm.avatarUrl"
                    :src="profileForm.avatarUrl"
                    class="h-full w-full object-cover"
                    alt="Avatar"
                  />
                  <div v-else class="h-full w-full flex items-center justify-center text-ink-400 font-bold text-xl uppercase">
                    {{ (profileForm.name || 'U')[0] }}
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-ink-700 mb-1 cursor-pointer">
                    <span class="rounded bg-white border border-ink-250 px-3 py-1.5 text-xs text-ink-800 shadow-sm hover:bg-ink-50 transition">Upload New Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleAvatarChange"
                    />
                  </label>
                  <p class="text-4xs text-ink-450 mt-1.5">JPG or PNG. Max size 2MB.</p>
                </div>
              </div>

              <!-- Input Forms -->
              <form @submit.prevent="handleSaveProfile" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-ink-700">Full Name</label>
                    <input
                      v-model="profileForm.name"
                      type="text"
                      required
                      class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-ink-700">Email Address</label>
                    <input
                      v-model="profileForm.email"
                      type="email"
                      required
                      class="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-500 focus:outline-none cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-ink-700">Company</label>
                    <input
                      v-model="profileForm.company"
                      type="text"
                      placeholder="e.g. Acme Corp"
                      class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-ink-700">Job Title</label>
                    <input
                      v-model="profileForm.jobTitle"
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer"
                      class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-ink-700">Timezone</label>
                    <select
                      v-model="profileForm.timezone"
                      class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                    >
                      <option value="UTC">UTC</option>
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>

                <div class="flex justify-end gap-2 pt-4">
                  <BaseButton variant="secondary" type="button" @click="handleResetProfile">Reset Changes</BaseButton>
                  <BaseButton type="submit">Save Profile</BaseButton>
                </div>
              </form>
            </div>
          </div>

          <!-- Appearance Settings -->
          <div v-if="activeTab === 'appearance'" class="space-y-6">
            <div class="bg-white rounded-xl border border-ink-200 p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-semibold text-ink-900 border-b border-ink-100 pb-3">Appearance & Styling</h2>

              <form @submit.prevent="handleSaveAppearance" class="space-y-6">
                <!-- Theme Option -->
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-ink-700 block">Theme Mode</label>
                  <div class="grid gap-3 sm:grid-cols-3">
                    <label
                      v-for="mode in ['LIGHT', 'DARK', 'SYSTEM']"
                      :key="mode"
                      class="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-ink-50 transition"
                      :class="appearanceForm.theme === mode ? 'border-accent-500 bg-accent-50/20' : 'border-ink-200'"
                    >
                      <input
                        type="radio"
                        v-model="appearanceForm.theme"
                        :value="mode"
                        class="h-4 w-4 text-accent-600 border-ink-300 focus:ring-accent-500"
                      />
                      <span class="text-sm font-semibold text-ink-800">{{ mode }}</span>
                    </label>
                  </div>
                </div>

                <!-- Sidebar Option -->
                <div class="space-y-2">
                  <label class="text-xs font-semibold text-ink-700 block">Sidebar Default State</label>
                  <div class="grid gap-3 sm:grid-cols-2">
                    <label
                      v-for="mode in ['EXPANDED', 'COLLAPSED']"
                      :key="mode"
                      class="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-ink-50 transition"
                      :class="appearanceForm.sidebarMode === mode ? 'border-accent-500 bg-accent-50/20' : 'border-ink-200'"
                    >
                      <input
                        type="radio"
                        v-model="appearanceForm.sidebarMode"
                        :value="mode"
                        class="h-4 w-4 text-accent-600 border-ink-300 focus:ring-accent-500"
                      />
                      <span class="text-sm font-semibold text-ink-800">{{ mode }}</span>
                    </label>
                  </div>
                </div>

                <div class="flex justify-end pt-2">
                  <BaseButton type="submit">Save Appearance</BaseButton>
                </div>
              </form>
            </div>
          </div>

          <!-- Work Preferences -->
          <div v-if="activeTab === 'work'" class="space-y-6">
            <div class="bg-white rounded-xl border border-ink-200 p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-semibold text-ink-900 border-b border-ink-100 pb-3">Work Preferences</h2>

              <form @submit.prevent="handleSaveWork" class="space-y-6">
                <!-- Working Days -->
                <div class="space-y-2">
                  <span class="text-xs font-semibold text-ink-700 block">Active Working Days</span>
                  <div class="grid gap-2 grid-cols-2 sm:grid-cols-4">
                    <label
                      v-for="day in daysOfWeek"
                      :key="day"
                      class="flex items-center gap-2 border border-ink-200 rounded-lg px-3 py-2 text-sm text-ink-700 cursor-pointer hover:bg-ink-50"
                    >
                      <input
                        type="checkbox"
                        v-model="workForm.workingDays"
                        :value="day"
                        class="h-4 w-4 rounded border-ink-300 text-accent-600 focus:ring-accent-500"
                      />
                      <span class="capitalize text-xs font-medium">{{ day.toLowerCase() }}</span>
                    </label>
                  </div>
                </div>

                <!-- Auto task rollover -->
                <div class="flex items-start justify-between gap-4 border-t border-ink-100 pt-4">
                  <div class="space-y-1">
                    <span class="text-sm font-bold text-ink-900">Auto Move Unfinished Tasks</span>
                    <p class="text-xs text-ink-450">If enabled, unfinished tasks automatically transfer to the next active working day at rollover time.</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="workForm.autoTaskRollover"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
                  </label>
                </div>

                <!-- Rollover Time -->
                <div class="space-y-1 border-t border-ink-100 pt-4 max-w-xs">
                  <label class="text-xs font-semibold text-ink-700">Task Rollover Time</label>
                  <input
                    v-model="workForm.rolloverTime"
                    type="time"
                    class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                  />
                </div>

                <div class="flex justify-end pt-2">
                  <BaseButton type="submit">Save Preferences</BaseButton>
                </div>
              </form>
            </div>
          </div>

          <!-- Account Settings -->
          <div v-if="activeTab === 'account'" class="space-y-6">
            <div class="bg-white rounded-xl border border-ink-200 p-6 shadow-sm space-y-6">
              <h2 class="text-lg font-semibold text-ink-900 border-b border-ink-100 pb-3">Account Security</h2>

              <!-- Password change -->
              <form @submit.prevent="handleUpdatePassword" class="space-y-4">
                <h3 class="text-sm font-bold text-ink-800">Change Password</h3>
                
                <div v-if="passwordError" class="text-xs font-semibold text-red-650 bg-red-50 border border-red-200 rounded-lg p-3">
                  {{ passwordError }}
                </div>

                <div class="space-y-3 max-w-md">
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-ink-700">Current Password</label>
                    <input
                      v-model="passwordForm.currentPassword"
                      type="password"
                      required
                      class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-ink-700">New Password</label>
                    <input
                      v-model="passwordForm.newPassword"
                      type="password"
                      required
                      class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-semibold text-ink-700">Confirm New Password</label>
                    <input
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      required
                      class="w-full rounded-lg border border-ink-250 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div class="flex justify-start gap-2 pt-2 border-t border-ink-100 mt-6">
                  <BaseButton type="submit">Update Password</BaseButton>
                </div>
              </form>
            </div>

            <!-- Danger Zone -->
            <div class="bg-red-50 rounded-xl border border-red-200 p-6 shadow-sm space-y-4">
              <h2 class="text-base font-bold text-red-800">Danger Zone</h2>
              <p class="text-xs text-red-750">Logout of your account. You will need to login again to access your career metrics.</p>
              <div>
                <button
                  type="button"
                  @click="handleLogout"
                  class="rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 shadow-sm transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>
