<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-sm"
    title="Editar Grupo"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <div class="gap-4 mb-2">
        <select
          v-model="form.status"
          placeholder="Estatus"
          :class="[
            'w-full rounded px-2 py-1 text-md border',
            pageThemeStore.borderColor
          ]">
          <option value="" disabled>Seleccione un estatus</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="finished">Finalizado</option>
        </select>
      </div>
    </template>
    <template #options>
      <button 
        @click="editGroup()"
        :class="['bcb-modal', pageThemeStore.bgColor]">
        Editar
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
  const groupId = ref(null);
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  const form = ref({
    status: "",
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    group: {
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
      () => props.group, () => props.modelValue
    ],
    () => {
      if (props.modelValue) {
        groupId.value = props.group;
      }
    },
    { immediate: true }
  );

  const editGroup = async () => {
    loading.value = true;
    success.value = "";
    error.value = "";
    
    const url = import.meta.env.VITE_GROUPS;
    const urlEdit = `${url}/${groupId.value}`;
    const body = form.value;
    
    try {
      const response = await api.put(urlEdit, body);
      if (response.status == 200) {
        success.value = response.data.message;
      }
      else {
        error.value = response.data.error || 'Error al editar el grupo.';
      }
    } 
    catch (e) {
      error.value = e.response?.data?.error || 'Error al editar el grupo.';
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

    error.value = "";
    success.value = "";

    groupId.value = null;
    form.value.status = "";
  };

</script>
