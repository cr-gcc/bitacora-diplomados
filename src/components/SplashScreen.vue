<template>
  <div v-if="isLoadingSS" class="fixed inset-0 flex items-center justify-center bg-gray-800 opacity-75 z-[9999]">
    <div class="p-6 rounded-lg max-w-sm w-full text-center">
      <div class="border-4 border-t-4 border-gray-300 border-t-gray-600 rounded-full h-16 w-16 animate-spin mx-auto"></div>
      <p class="mt-4 text-lg text-white">Cargando...</p>
    </div>
  </div>
</template>
<script setup>
defineProps({
  isLoadingSS: {
    type: Boolean,
    required: true
  }
})
</script>
