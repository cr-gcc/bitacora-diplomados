<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-lg"
    title="Agregar Usuario"
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
        <div class="col-span-3">
          <span class="whitespace-nowrap">Rol</span>
          <select v-model="form.role_id" class="base-input-gray">
            <option value="" disabled selected>Selecciona un rol</option>
            <option v-for="role in props.roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>
    </template>
    <template #options>
      <button 
        @click="addUser()"
        :disabled="loading"
        class="bcb-modal bg-sky-900">
        Agregar
      </button>
      <button 
        @click="closeModal()"
        :disabled="loading"
        class="bcb-modal bg-sky-900">
        Salir
      </button>
    </template>
  </BaseModal>
</template>
<script setup>
  import { ref, computed, onMounted } from 'vue';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';

  const success = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const form = ref({
    name: '',
    last_name: '',
    email: '',
    role_id: '',
  });

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:modelValue', 'refresh']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  const addUser = async () => {
    loading.value = true;
    error.value = '';
    success.value = '';
    //
    const url = import.meta.env.VITE_PROFILES;
    const body = form.value;
    try {
      const response = await api.post(url, body);
      if (response.status === 200) {
        success.value = response.data.message;
      }
      else {
        error.value = response.data.message;
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al guardar el usuario.';
    } finally {
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

    form.value.name = '';
    form.value.last_name = '';
    form.value.email = '';
    form.value.role_id = '';
  };
  
</script>