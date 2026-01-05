<template>
  <div v-if="modelValue" @click.self="handleBackdropClick" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black opacity-70"></div>
    <div :class="['relative bg-gray-300 rounded-lg shadow-xl w-full px-4 py-2 z-10', modalWidth]">
      <div class="flex justify-between items-center mb-2">
        <h2 :class="['text-2xl font-semibold', pageThemeStore.textColor]">{{ title }}</h2>
      </div>
      <div class="mb-1">
        <slot name="body"/>
        <div class="alerts">
          <div v-if="error" class="mt-2 mb-1">
            <p class="text-red-700">{{ error }}</p>
          </div>
          <div v-if="success" class="mt-2 mb-1">
            <p class="text-lime-700">{{ success }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-1">
          <slot name="options"/>
        </div>
        <div v-if="loading" class="mt-2">
          <PB/>  
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted, watch } from 'vue';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import PB from '@/components/ui/ProgressBar.vue';

  const pageThemeStore = usePageThemeStore();
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: true
    },
    modalWidth: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Modal'
    },
    error: {
      type: String,
      default: null
    },
    success: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    closeOnBackdrop: {
      type: Boolean,
      default: false
    },
    closeOnEscape: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:modelValue']);

  const handleBackdropClick = () => {
		if (props.closeOnBackdrop) {
			emit('update:modelValue', false);
		}
	};

	// Prevenir scroll del body cuando el modal está abierto
	watch(() => props.modelValue, (isOpen) => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	// Cerrar con tecla ESC
	const handleEscape = (e) => {
		if (e.key === 'Escape' && props.modelValue && props.closeOnEscape) {
			emit('update:modelValue', false);
		}
	};

	if (typeof window !== 'undefined') {
		window.addEventListener('keydown', handleEscape);
	}

  onUnmounted(() => {
    document.body.style.overflow = '';
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleEscape);
    }
  });

</script>
