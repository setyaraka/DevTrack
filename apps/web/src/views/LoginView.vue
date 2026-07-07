<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;

  try {
    await authStore.login({ email: email.value, password: password.value });
    await router.push({ name: 'dashboard' });
  } catch {
    error.value = 'Unable to sign in with those credentials.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <p class="text-sm font-semibold text-accent-600">Welcome back</p>
    <h1 class="mt-2 text-3xl font-semibold text-ink-900">Sign in to DevTrack</h1>
    <form class="mt-8 space-y-5" @submit.prevent="submit">
      <BaseInput
        id="email"
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
      />
      <BaseInput
        id="password"
        v-model="password"
        label="Password"
        type="password"
        autocomplete="current-password"
        placeholder="••••••••"
      />
      <p v-if="error" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
      <BaseButton class="w-full" type="submit" :loading="loading">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </BaseButton>
    </form>
    <p class="mt-6 text-center text-sm text-ink-500">
      New to DevTrack?
      <RouterLink class="font-medium text-accent-600" to="/auth/register">Create an account</RouterLink>
    </p>
  </div>
</template>
