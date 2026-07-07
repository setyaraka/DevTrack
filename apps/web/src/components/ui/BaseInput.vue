<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <label :for="id" class="block">
    <span class="mb-1.5 block text-sm font-medium text-ink-700">{{ label }}</span>
    <input
      :id="id"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="h-10 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-ink-500 focus:border-accent-500 focus:ring-4 focus:ring-blue-100"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
