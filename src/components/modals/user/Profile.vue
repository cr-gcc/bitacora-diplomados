<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-xl"
    title="Mi Perfil"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <div class="grid-max-3 gap-4 mb-2">
        <div>
          <span class="whitespace-nowrap">Nombre</span>
          <input v-model="form.name" type="text" class="base-input-gray"/>
        </div>
        <div>
          <span class="whitespace-nowrap">Apellidos</span>
          <input v-model="form.last_name" type="text" class="base-input-gray"/>
        </div>
        <div>
          <span class="whitespace-nowrap">Email</span>
          <input v-model="form.email" type="email" class="base-input-gray"/>
        </div>
      </div>
    </template>
    <template #options>
      <button 
        @click="editUser()"
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="closeModal()"
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
    name:auth.user.name,
    last_name:auth.user.last_name,
    email:auth.user.email
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },

  });

  const emit = defineEmits(['update:modelValue', 'refresh']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const editUser = async () => {
    loading.value = true;
    error.value = null;
    success.value = null;
    //
    const urlProfile = import.meta.env.VITE_PROFILES;
    const url = `${urlProfile}/${auth.user.id}`;
    const body = form.value;
    //
    try {
      const response = await api.put(url, body);
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