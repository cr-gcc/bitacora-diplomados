<template>
  <BaseModal 
    v-model="isOpen"
    modalWidth="max-w-2xl"
    title="Revisión Curso"
    :error="error"
    :success="success"
    :loading="loading"  
  >
    <template #body>
      <div class="grid-max-3 gap-4 mb-2">
        <div class="flex items-center gap-3">
          <span class="whitespace-nowrap">Plan de Trabajo</span>
          <label
            for="plan"
            class="relative block h-6 w-10 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-sky-800 dark:bg-gray-600 dark:has-checked:bg-sky-800"
          >
            <input v-model="form.study_plan" type="checkbox" id="plan" class="peer sr-only" />
            <span
              class="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4 dark:bg-gray-300"
            ></span>
          </label>
        </div>
        <div class="flex items-center gap-3">
          <span class="whitespace-nowrap">Fechas</span>
          <label
            for="dates"
            class="relative block h-6 w-10 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-sky-800 dark:bg-gray-600 dark:has-checked:bg-sky-800"
          >
            <input v-model="form.dates" type="checkbox" id="dates" class="peer sr-only" />
            <span
              class="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4 dark:bg-gray-300"
            ></span>
          </label>
        </div>
        <div class="flex items-center gap-3">
          <span class="whitespace-nowrap">Grupo con Usuarios</span>
          <label
            for="users_in_group"
            class="relative block h-6 w-10 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-sky-800 dark:bg-gray-600 dark:has-checked:bg-sky-800"
          >
            <input v-model="form.users_in_group" type="checkbox" id="users_in_group" class="peer sr-only" />
            <span
              class="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4 dark:bg-gray-300"
            ></span>
          </label>
        </div>
        <div class="flex items-center gap-3">
          <span class="whitespace-nowrap">Examen</span>
          <select
            v-model="form.exam"
            class="base-input-gray"
          >
            <option value="pendant">Pendiente</option>
            <option value="tested">Realizado</option>
          </select>
        </div>
        <div class="flex items-center gap-3">
          <span class="whitespace-nowrap">Estudiantes</span>
          <input v-model="form.students" type="number" class="base-input-gray"/>
        </div>
        <div class="flex items-center gap-3">
          <span class="whitespace-nowrap">Recursadores</span>
          <input v-model="form.repeaters" type="number" class="base-input-gray"/>
        </div>
        <div class="flex items-center gap-3">
          <span class="whitespace-nowrap">Total</span>
          <input v-model="totalStudents" type="number" class="base-input-gray" disabled/>
        </div>
        <div class="flex items-center gap-3">
          <span class="whitespace-nowrap">Grupo Visible</span>
          <label
            for="visible"
            class="relative block h-6 w-10 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-sky-800 dark:bg-gray-600 dark:has-checked:bg-sky-800"
          >
            <input v-model="form.visible" type="checkbox" id="visible" class="peer sr-only" />
            <span
              class="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4 dark:bg-gray-300"
            ></span>
          </label>
        </div>
        <div class="md:col-span-3">
          <label for="comentario">Comentario</label>
          <textarea v-model="form.comments" id="comentario"
            class="base-input-gray mt-0.5 w-full h-24 resize-none rounded border-gray-300 shadow-sm sm:text-sm"
            placeholder="Escribe tu comentario aquí..."
          ></textarea>
        </div>
        <div>
          {{ form }} {{ courseId }}
        </div>
      </div>
    </template>
    <template #options>
      <button
        @click="editReview()"
        :class="['bo-mini', pageThemeStore.bgColor]">
        Guardar
      </button>
      <button
        @click="closeModal()"
        :class="['bo-mini', pageThemeStore.bgColor]">
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
  const reviewId = ref(null);
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  const form = ref({
    study_plan: false,
    dates: false,
    users_in_group: false,
    exam: 'pendant',
    students: 0,
    repeaters: 0,
    visible: false,
    comments: '',
  });
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    review: {
      type: Number,
      default: 0,
    },
  });

  const emit = defineEmits(['update:modelValue', 'refresh']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const totalStudents = computed(
    () => form.value.students + form.value.repeaters
  );

  watch(
    [
      () => props.review, () => props.modelValue
    ],  
    () => {
      if (props.modelValue) {
        reviewId.value = props.review;
      }
    },
    { immediate: true }
  );

  const editReview = async () => {
    loading.value = true;
    success.value = "";
    error.value = "";
    const endpointReviews = import.meta.env.VITE_REVIEWS;
    const url = `${endpointReviews}/${reviewId.value}`;
    try {
      const response = await api.put(url, form.value);
      if (response.status == 200) {
        success.value = response.data.message;
      }
      else {
        error.value = response.data.error || 'Error al editar la revision del curso.';
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al editar la revision del curso.';
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

    form.value.study_plan = false;
    form.value.dates = false;
    form.value.users_in_group = false;
    form.value.exam = 'pendant';
    form.value.students = 0;
    form.value.repeaters = 0;
    form.value.visible = false;
    form.value.comments = '';
  };
</script>