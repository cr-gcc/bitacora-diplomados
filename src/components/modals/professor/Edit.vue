<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-2xl"
    title="Profesor"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <div class="grid-max-3 gap-4 mb-2">
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Nombre(s)</span>
          <input v-model="form.name" type="text" class="base-input-gray" placeholder="NombreA NombreB"/>
        </div>
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Apellidos</span>
          <input v-model="form.last_name" type="text" class="base-input-gray" placeholder="ApellidoP ApellidoM"/>
        </div>
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Email</span>
          <input v-model="form.email" type="email" class="base-input-gray" placeholder="usuario@ejemplo.com"/>
        </div>
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">RFC</span>
          <input v-model="form.rfc" type="text" class="base-input-gray" placeholder="Con homoclave"/>
        </div>
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Usuario</span>
          <input v-model="form.user" type="text" class="base-input-gray" placeholder="No. Empleado"/>
        </div>
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Contraseña</span>
          <input v-model="form.password" type="password" class="base-input-gray" placeholder="Dejar en blanco para conservar la actual"/>
        </div>
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Estatus</span>
          <select v-model="form.active" class="base-input-gray">
            <option value="" disabled>Seleccione un estatus</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>
      </div>
    </template>
    <template #options>
      <button
        @click="editProfessor()"
        :class="['bcb-modal', pageThemeStore.bgColor]">
        Guardar
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
  import { truncate } from '@/utils/strTruncate';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';
  
  const pageThemeStore = usePageThemeStore(); 
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  const form = ref({
    name: null,
    last_name: null,
    email: null,
    rfc: null,
    user: null,
    password: null,
    active: null,
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    professor: {
      type: Object,
      default: () => {}
    }
  });

  const emit = defineEmits(['update:modelValue', 'refresh']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  watch(
    () => form.value.rfc,
    (newVal) => {
      if (newVal && (newVal !== props.professor.rfc)) {
        form.value.password = truncate(newVal, 10, false);
      }
    }
  );

  watch(
    [
      () => props.professor, () => props.modelValue
    ],
    () => {
      if (props.modelValue) {
        form.value.name = props.professor.name;
        form.value.last_name = props.professor.last_name;
        form.value.email = props.professor.email;
        form.value.rfc = props.professor.rfc;
        form.value.user = props.professor.user;
        form.value.password = props.professor.password;
        form.value.active = props.professor.active;
      }
    },
    { immediate: true }
  );

  const editProfessor = async () => {
    loading.value = true;
    error.value = null;
    success.value = null;
    //
    const urlProfessors = import.meta.env.VITE_PROFESSORS;
    const url = `${urlProfessors}/${props.professor.id}`;
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
      error.value = e.response?.data?.message || 'Error al editar el profesor.';
    } 
    finally {
      loading.value = false;
    }
  };

  const closeModal = () => {
    isOpen.value = false;
    //
    if (success.value) {
      emit('refresh');
    }
    //
    error.value = null;
    success.value = null;
    //
    form.value.name = null;
    form.value.last_name = null;
    form.value.email = null;
    form.value.rfc = null;
    form.value.user = null;
    form.value.password = null;
    form.value.active = null;
  };
</script>
