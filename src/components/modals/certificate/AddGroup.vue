<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-sm"
    title="Agregar Grupo"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <div class="gap-4 mb-2">
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Grupo</span>
          <input v-model="form.code" type="text" class="base-input-gray" placeholder="Ejemplo: 9041"/>
        </div>
      </div>
    </template>
    <template #options>
      <button 
        @click="addGroup()"
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
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';
  
  const pageThemeStore = usePageThemeStore(); 
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  const form = ref({
    certificate_id: null,
    code: null,
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    certificate: {
      type: Number,
      default: 0
    }
  });

  const emit = defineEmits(['update:modelValue', 'refresh']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  watch(
    [
      () => props.certificate, () => props.modelValue
    ],
    () => {
      if (props.modelValue) {
        form.value.certificate_id = props.certificate;
      }
    },
    { immediate: true }
  );

  const addGroup = async () => {
    loading.value = true;
    error.value = null;
    success.value = null;
    //
    const url = import.meta.env.VITE_GROUPS;
    const body = form.value;
    //
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
      error.value = e.response.data.message || 'Error al guardar el grupo.';
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

    error.value = null;
    success.value = null;

    form.value.certificate_id = null
    form.value.code = null
  };
</script>