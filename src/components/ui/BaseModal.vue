<template>
  <Teleport to="body">
    <div v-if="modelValue" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-black/70 transition-opacity"></div>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" @click.self="handleBackdropClick">
          <div :class="['relative transform overflow-hidden rounded-lg bg-gray-300 text-left shadow-xl transition-all w-full px-4 py-2 sm:my-8', modalWidth]">
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
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { onUnmounted, watch } from 'vue';
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
