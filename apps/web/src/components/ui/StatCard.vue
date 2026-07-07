<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  caption?: string;
}>();
</script>

<template>
  <BaseCard class="p-4">
    <p class="text-sm font-medium text-ink-500">{{ label }}</p>
    <p class="mt-3 text-2xl font-semibold text-ink-900">{{ value }}</p>
    <p v-if="caption" class="mt-1 text-xs text-ink-500">{{ caption }}</p>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from './BaseCard.vue';
</script>
