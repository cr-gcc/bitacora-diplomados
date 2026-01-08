<template>
  <BaseModal
    v-model="isOpen"
    modalWidth="max-w-md"
    title="Editar Curso"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <div class="grid-max-2 gap-4 mb-2">
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Fecha de Inicio</span>
          <input v-model="form.start_date" type="date" class="base-input-gray"/>
        </div>
        <div>
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Fecha de Termino</span>
          <input v-model="form.end_date" type="date" class="base-input-gray"/>
        </div>
        <div class="col-span-2">
          <span :class="['whitespace-nowrap', pageThemeStore.textColor]">Profesor</span>
          <select
            v-model="form.professor_id"
            class="base-input-gray"
          >
            <option value="null" disabled>Seleccione un profesor</option>
            <option v-for="professor in professors" :value="professor.id" :key="'ind_'+professor.id">
              {{ professor.name }} {{ professor.last_name }}
            </option>
          </select>
        </div>
      </div>
    </template>
    <template #options>
      <button 
        @click="editCourse()"
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
  import { ref, onMounted, computed, watch } from 'vue';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';

  const pageThemeStore = usePageThemeStore();
  const courseId = ref(null);
  const professors = ref([]);
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  const form = ref({
    start_date: null,
    end_date: null,
    professor_id: null,
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    course: {
      type: Object,
      default: () => ({})
    }
  });

  const emit = defineEmits(['update:modelValue','refresh']);

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
        courseId.value = props.course.id;
        form.value.start_date = props.course.startDate;
        form.value.end_date = props.course.endDate;
        form.value.professor_id = props.course.professorId;
      }
    },
    { immediate: true }
  );

  const editCourse = async () => {
    loading.value = true;
    error.value = null;
    success.value = null;
    //
    const urlCourse = import.meta.env.VITE_COURSES;
    const url = `${urlCourse}/${courseId.value}`;
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
      error.value = e.response.data.message || 'Error al editar el curso.';
    } 
    finally {
      loading.value = false;
    }
  };

  const getActiveProfessors = async () => {
    loading.value = true;
    const urlProfessors = import.meta.env.VITE_PROFESSORS;
    const url = `${urlProfessors}/by-status/1`;
    
    try {
      const response = await api.get(url);
      professors.value = response.data; 
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error consultar el profesor';
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

    courseId.value = null;
    form.value.start_date = null;
    form.value.end_date = null;
    form.value.professor_id = null;
  }

  onMounted(() => {
    getActiveProfessors();
  })
</script>