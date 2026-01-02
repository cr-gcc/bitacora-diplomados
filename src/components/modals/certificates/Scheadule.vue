<template>
  <BaseModal 
    v-model="isOpen" 
    modalWidth="max-w-4xl" 
    title="Diplomados"
    :error="error"
    :success="success"
  >
    <template #body>
      <div class="max-h-[400px] overflow-auto mb-2">
        <table class="table-auto w-full min-w-max">
          <thead class="text-left">
            <tr>
            <th class="px-1 font-bold">#</th>
            <th class="px-1">Diplomado</th>
            <th class="px-1">Grupo</th>
            <th class="px-1">Módulo</th>
            <th class="px-1">Inicio</th>
            <th class="px-1">Fin</th>
            <th class="px-1">Profesor</th>
            <th class="px-1">Visible</th>
            <th class="px-1">Opciones</th>
          </tr>
        </thead>
          <tbody class="divide-y divide-gray-300">
            <tr v-for="(course, ind) in courses" :key="'course'+ind" :class="'text-'+course.certificate_color">
              <td class="font-bold">{{ ind+1 }}</td>
              <td class="px-1">{{ course.certificate_short_name }}</td>
              <td class="px-1">{{ course.group_code }}</td>
              <td class="px-1">{{ course.module_number }}</td>
              <td class="px-1">{{ dateFormat(course.start_date) }}</td>
              <td class="px-1">{{ dateFormat(course.end_date) }}</td>
              <td class="px-1">
                {{ 
                  course.professor_name ? 
                  truncate(course.professor_name+"  "+course.professor_last_name, 30) : 
                  "Sin profesor asignado" 
                }}
              </td>
              <td class="px-1">
                {{
                  course.visible ?
                  "SI" :
                  "No"
                }}</td>
                <td class="px-1">
                  <a :href="router.resolve({ 
                      path: `${course.certificate_local_url}`, 
                      query: { code: course.group_code } 
                    }).href" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Revisar
                  </a>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template #options>
      <button
        @click="closeModal()"
        class="bcb-modal bg-sky-800">
        Salir
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from '@/stores/useAppStore';
  import { dateFormat } from '@/utils/dateFormat';
  import { truncate } from '@/utils/strTruncate';
  import BaseModal from '@/components/ui/BaseModal.vue';
  import api from '@/plugins/axios';
  
  const router = useRouter();
  const app = useAppStore();
  const courses = ref([]);
  const error = ref('');
  const success = ref('');
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    date: {
      type: Object,
      default: () => ({ day: null, month: null, year: null })
    }
  });

  const emit = defineEmits(['update:modelValue']);

  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });

  const getSchedulCourses = async () => {
    app.loadingApp = true;
    const formattedDate = `${props.date.year}-${String(props.date.month + 1).padStart(2, '0')}-${String(props.date.day).padStart(2, '0')}`;
    const url = import.meta.env.VITE_COURSES_CALENDAR;
    const body = {
      date: formattedDate
    };
    //
    try {
      const response = await api.post(url, body);
      if (response.status == 200) {
        const data = response.data.data;
        if (data.length) {
          courses.value = data;
        }
        else {
          error.value = `No se encontraron registros con la fecha ${formattedDate}`;
        }
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el calendario de diplomados.';
    } finally {
      app.loadingApp = false;
    }
  };

  watch(
    () => props.modelValue, 
    (isOpen) => {
      if(isOpen){
        getSchedulCourses();
      }
    }
  );

  const closeModal = () => {
    isOpen.value = false;
    error.value = null;
    success.value = null;
    courses.value = [];
  };
</script>