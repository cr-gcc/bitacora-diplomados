<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-sm"
    title="Cambio de Contraseña"
    :error="error"
    :success="success"
    :loading="loading"
  >
    <template #body>
      <div class="mb-2">
        <div>
          <span class="whitespace-nowrap">Contraseña</span>
          <input v-model="form.password" type="password" class="base-input-gray"/>  
        </div>
        <div>
          <span class="whitespace-nowrap">Confirmar Contraseña</span>
          <input v-model="form.password_confirmation" type="password" class="base-input-gray"/>
        </div>
      </div>
    </template>
    <template #options>
      <button 
        v-if="!success"
        @click="changePassword()"
        :disabled="loading"
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        v-if="!forced || success"
        @click="closeModal()"
        :disabled="loading"
        class="bcb-modal bg-sky-800">
        Salir
      </button>
    </template>
  </BaseModal>
</template>
<script setup>
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/useAuthStore';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';

  const auth = useAuthStore();
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  const form = ref({
    password: '',
    password_confirmation: ''
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    forced: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:modelValue', 'confirm']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const changePassword = async () => {
    error.value = null;
    success.value = null;
    //
    if (form.value.password !== form.value.password_confirmation) {
      error.value = "Las contraseñas no coinciden.";
      return;
    }
    if (form.value.password.length < 8) {
      error.value = "La contraseña debe tener al menos 8 caracteres.";
      return;
    } 
    loading.value = true;
    //
    const urlPassword = import.meta.env.VITE_PASSWORD;
    const url = `${urlPassword}/change`;
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
      error.value = e.response?.data?.error || 'Error al cambiar la contraseña.';
    } 
    finally {
      loading.value = false;
    }
  };

  const closeModal = async () => {
    isOpen.value = false;

    if (success.value) {
      await auth.fetchUser();
      emit('confirm');
    }

    error.value = '';
    success.value = '';
  };
</script>