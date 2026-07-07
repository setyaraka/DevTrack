<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;

  try {
    await authStore.register({ name: name.value, email: email.value, password: password.value });
    await router.push({ name: 'dashboard' });
  } catch {
    error.value = 'Unable to create your account.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <p class="text-sm font-semibold text-accent-600">Start your record</p>
    <h1 class="mt-2 text-3xl font-semibold text-ink-900">Create your DevTrack account</h1>
    <form class="mt-8 space-y-5" @submit.prevent="submit">
      <BaseInput id="name" v-model="name" label="Name" autocomplete="name" placeholder="Ada Lovelace" />
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
        autocomplete="new-password"
        placeholder="At least 8 characters"
      />
      <p v-if="error" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
      <BaseButton class="w-full" type="submit" :loading="loading">
        {{ loading ? 'Creating account...' : 'Create account' }}
      </BaseButton>
    </form>
    <p class="mt-6 text-center text-sm text-ink-500">
      Already have an account?
      <RouterLink class="font-medium text-accent-600" to="/auth/login">Sign in</RouterLink>
    </p>
  </div>
</template>
