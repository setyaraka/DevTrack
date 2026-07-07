<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost';
    type?: 'button' | 'submit';
    loading?: boolean;
  }>(),
  {
    variant: 'primary',
    type: 'button',
    loading: false,
  },
);
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    class="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'bg-accent-600 text-white hover:bg-accent-500': variant === 'primary',
      'border border-ink-200 bg-white text-ink-700 hover:bg-ink-50': variant === 'secondary',
      'text-ink-700 hover:bg-ink-100': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
