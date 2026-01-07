<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-sm"
    title="Crear Revisión"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <p>La creación de revisión ayuda al control del grupo. ¿Desea crear la revisión?</p>
    </template>
    <template #options>
      <button 
        @click="createReview()"
        :class="['bcb-modal', pageThemeStore.bgColor]">
        Crear
      </button>
      <button 
        @click="closeModal()"
        :class="['bcb-modal', pageThemeStore.bgColor]">
        Salir
      </button>
    </template>
  </BaseModal>
</template>
<script setup>
  import { ref, computed, watch } from 'vue';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';

  const pageThemeStore = usePageThemeStore();
  const loading = ref(false);
  const success = ref('');
  const error = ref('');
  const form = ref({
    course_id: "",
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    course: {
      type: Number,
      default: 0
    },
  });

  const emit = defineEmits(['update:modelValue', 'refresh']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  watch(
    [
      () => props.course, () => props.modelValue
    ],
    () => {
      if (props.modelValue) {
        form.value.course_id = props.course;
      }
    },
    { immediate: true }
  );

  const createReview = async () => {
    loading.value = true;
    success.value = "";
    error.value = "";
    
    const url = import.meta.env.VITE_REVIEWS;
    const body = form.value;
    
    try {
      const response = await api.post(url, body);
      if (response.status === 200) {
        success.value = response.data.message;
      }
      else {
        error.value = response.data.message;
      }
    } 
    catch (e) {
      error.value = e.response.data.message || 'Error al crear la revisión.';
    } 
    finally {
      loading.value = false;
    }
  }

  const closeModal = () => {
    isOpen.value = false;
    
    if (success.value) {
      emit('refresh');
    }

    error.value = "";
    success.value = "";

    form.value.course_id = "";
  };

</script>