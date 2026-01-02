<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-70"></div>
    <div :class="'relative bg-gray-300 rounded-lg shadow-xl w-full px-4 py-2 z-10 '+modalWidth">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-2xl font-semibold text-slate-900">{{ title }}</h2>
      </div>
      <div class="mb-1">
        <slot name="body"/>
        <slot name="messages"/>
        <div class="flex justify-end gap-1">
          <slot name="buttons">
            <button 
              @click="closeModal()"
              class="bcb-modal bg-sky-800">
              Salir
            </button>
          </slot>
        </div>
        <div v-if="progressBar" class="mt-2">
          <PB/>  
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import PB from '@/components/ui/ProgressBar.vue';
  
  defineProps({
    modelValue: Boolean,
    modalWidth: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Modal'
    },
    progressBar: {
      type: Boolean,
      default: false
    }
  });

  defineEmits(['update:modelValue']);
</script>
