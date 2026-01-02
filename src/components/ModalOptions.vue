@@ -1,25 +0,0 @@
<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-70"></div>
    <div class="relative bg-gray-300 rounded-lg shadow-xl max-w-3xl w-full px-4 py-2 z-10">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-2xl font-semibold text-slate-900">{{ title }}</h2>
      </div>
      <div class="mb-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: 'Modal'
  }
});

defineEmits(['update:modelValue']);
</script>