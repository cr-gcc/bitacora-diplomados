<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-lg"
    title="Editar Usuario"
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
        @click="editUser()"
        :disabled="loading"
        class="bcb-modal bg-sky-900">
        Editar
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
  import { ref, computed, onMounted, watch } from 'vue';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';
  const success = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const userId = ref(null);
  const form = ref({
    name: '',
    last_name: '',
    email: '',
    role_id: '',
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    roles: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:isOpen', 'refresh']);
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });

  watch(() => props.modelValue, (isOpen) => {
    if (isOpen && props.user) {
      userId.value = props.user.id;
      form.value.name = props.user.name || '';
      form.value.last_name = props.user.last_name || '';
      form.value.email = props.user.email || '';
      form.value.role_id = props.user.role_id || '';
    }
  });

  const editUser = async () => {
    loading.value = true;
    error.value = '';
    success.value = '';
    //
    const urlProfile = import.meta.env.VITE_PROFILES;
    const url = `${urlProfile}/${userId.value}`;
    const body = form.value;
    try {
      const response = await api.put(url, body);
      if (response.status === 200) {
        success.value = response.data.message;
      }
      else {
        error.value = response.data.message;
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al editar el usuario.';
    } finally {
      loading.value = false;
    }
  }
  
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