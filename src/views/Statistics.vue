<template>
  <div class="grid-max-4 gap-4 mb-4">
    <div>
      <span class="whitespace-nowrap">Diplomados</span>
      <select
        v-model="search.certificate_id"
        placeholder="Grupo"
        class="w-full rounded px-2 py-1 text-md border border-sky-900"
      >
        <option value="" disabled>Seleccione un diplomado</option>
        <option v-for="certificate in certificates" :key=certificate.id :value="certificate.id">
          {{ certificate.name }}
        </option>
        <option value="0">Todos</option>
      </select>  
    </div>
    <div>
      <span class="whitespace-nowrap">Grupo</span>
      <input
        v-model="search.code"
        type="number"
        placeholder="Eje. 9401"
        class="w-full rounded px-2 py-1 text-md border border-sky-900"
      />
    </div>
    <div>
      <span class="whitespace-nowrap">Fecha de Inicio</span>
      <input v-model="search.start_date" type="date" class="w-full rounded px-2 py-1 text-md border border-sky-900"/>
    </div>
    <div>
      <span class="whitespace-nowrap">Fecha de Término</span>
      <input v-model="search.end_date" type="date" class="w-full rounded px-2 py-1 text-md border border-sky-900"/>
    </div>
  </div>
  <div class="flex justify-end gap-3">
    <button @click="downloadData()" class="b-normal border-sky-900 bg-sky-900">
      Descargar
    </button>
    <button @click="searchData()" class="b-normal border-sky-900 bg-sky-900">
      Buscar
    </button>
  </div>
  <div v-if="courses" class="bg-gray-300 px-4 py-2 text-sm">
    <div class="overflow-x-auto">
      <table class="table-auto w-full min-w-max">
        <thead class="text-center">
          <tr>
            <th class="px-1 font-bold">Diplomado</th>
            <th class="px-1">Grupo</th>
            <th class="px-1">Modulo</th>
            <th class="px-1">Profesor</th>
            <th class="px-1">Fecha Inicio</th>
            <th class="px-1">Fecha Fin</th>
            <th class="px-1">Alumnos</th>
            <th class="px-1">Recursadores</th>
            <th class="px-1">Totales</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300 text-center">
          <tr v-for="course in courses" :key="course.id">
            <td class="px-1">{{ course.module.certificate.name }}</td>
            <!--Group-->
            <td class="px-1">{{ course.group.code }}</td>
            <!--Module-->
            <td class="px-1">{{ course.module.number }}</td>
            <!--Professor-->
            <td v-if="course.professor_id" class="px-1">
              {{ course.professor.name }} {{ course.professor.last_name }}
            </td>
            <td v-else class="px-1">Profesor no asignado</td>
            <!--Dates-->
            <td class="px-1">{{ course.start_date }}</td>
            <td class="px-1">{{ course.end_date }}</td>
            <!--Review-->
            <td v-if="course.review" class="px-1">
              {{ course.review.students }}
            </td>
            <td v-else class="px-1">0</td>
            <td v-if="course.review" class="px-1">
              {{ course.review.repeaters }}
            </td>
            <td v-else class="px-1">0</td>
            <td v-if="course.review" class="px-1">
              {{ course.review.students+course.review.repeaters }}
            </td>
            <td v-else class="px-1">0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <SplashScreen :isLoadingSS="loading" />
</template>
<script setup>
  import { onMounted,ref } from 'vue'; 
  import { useTitleStore } from '@/stores/useTitleStore';
  import axios from 'axios';

  const titleStore = useTitleStore();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpointCertificate = import.meta.env.VITE_CERTIFICATES
  const endpointCourses= import.meta.env.VITE_COURSES;
  const certificates = ref(null);
  const courses = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);
  const search = ref({
    'certificate_id':'',
    'code':'',
    'start_date':'',
    'end_date':''
  })

  titleStore.setColorTitle('Estadisticas', 'sky-900');

  //  Functions
  const setInitValues = (option) => {    
    loading.value = option==1 ? true : false;
    error.value = null;
    success.value = null;
  }
  const searchData = async () => {
    setInitValues(1);
    const url = `${apiBaseUrl}${endpointCourses}/statistics`;
    try {
      const response = await axios.post(url, search.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      courses.value = response.data;
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      loading.value = false;
    }
  }
  const downloadData = async () => {
    
  }

  //  Init functions
  const getCertificate = async () => {
    setInitValues(1);
    const url = `${apiBaseUrl}${endpointCertificate}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      certificates.value = response.data;
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } 
    finally {
      loading.value = false;
    }
  };

  //  Hooks
  onMounted(async () => {
    await getCertificate();
  });
</script>