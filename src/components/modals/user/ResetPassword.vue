<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-sm"
    title="Resetear Contraseña"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <div class="mb-2">
        <p>¿Esta seguro de resetear la contraseña a este usuario?</p>
      </div>
    </template>
    <template #options>
      <button 
        @click="resetPassword()"
        class="bcb-modal bg-sky-900">
        Resetear
      </button>
      <button 
        @click="closeModal()"
        class="bcb-modal bg-sky-900">
        Salir
      </button>
    </template>
  </BaseModal>
</template>
<script setup>
  import { ref, computed } from 'vue';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';

  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({})
    }
  });
  const emit = defineEmits(['update:modelValue', 'refresh']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  //  Funciones
  const resetPassword = async () => {
    loading.value = true;
    error.value = null;
    success.value = null;
    //
    const urlPassword = import.meta.env.VITE_PASSWORD;
    const id = props.user.id;
    const url = `${urlPassword}/reset/${id}`;
    //
    try {
      const response = await api.get(url);
      if (response.status === 200) {
        success.value = response.data.message;
      }
      else {
        error.value = response.data.message;
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al guardar el usuario.';
    } 
    finally {
      loading.value = false;
    }
  };
  const closeModal = () => {
    isOpen.value = false;
    if (success.value) {
      emit('refresh');
    }
    error.value = '';
    success.value = '';
  };
</script>