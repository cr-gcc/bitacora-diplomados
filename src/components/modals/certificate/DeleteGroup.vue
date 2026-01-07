<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-sm"
    title="Eliminar Grupo"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <p>Si elimina el grupo, todos los cursos se eliminarán tambien. ¿Desea eliminar el grupo?</p>
    </template>
    <template #options>
      <button 
        @click="deleteGroup()"
        :class="['bcb-modal', pageThemeStore.bgColor]">
        Eliminar
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
  const loading = ref(false);
  const success = ref('');
  const error = ref('');
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

  const deleteGroup = async () => {
    loading.value = true;
    success.value = "";
    error.value = "";
    
    const url = import.meta.env.VITE_GROUPS;
    const urlDelet = `${url}/${groupId.value}`;
    try {
      const response = await api.delete(urlDelet);
      if (response.status === 200) {
        success.value = response.data.message;
      }
      else {
        error.value = response.data.message;
      }
    } 
    catch (e) {
      error.value = e.response.data.message || 'Error al eliminar el grupo.';
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

    groupId.value = null;
    form.value.status = "";
  };

</script>