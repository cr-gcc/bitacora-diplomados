<template>
  <div v-if="certificate">
    <h3 class="text-3xl mb-2" :class="'text-'+certificate.color">Grupos</h3>
    <div class="grid-max-5 gap-4 mb-4">
      <div>
        <input
          type="text"
          placeholder="Buscar"
          class="w-full rounded px-2 py-1 text-md border"
          :class="'border-'+certificate.color"
          v-model="info"
          @keyup.enter="searchCourse()"
        />
      </div>
      <div>
        <button 
          @click="getCoursesByStatus(0)"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Finalizados
        </button>
      </div>
      <div>
        <button 
          @click="getCoursesByStatus(1)"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Activos
        </button>
      </div>
      <div>
        <button 
          @click="getGroupCourses()"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Todos
        </button>
      </div>
      <div>
        <button 
          @click="openModalCourse(0)"
          class="bcb-certificate" 
          :class="['border-'+certificate.color, 'bg-'+certificate.color]">
          Agregar
        </button>
      </div>
    </div>
    <div v-if="groups.length>0" class="space-y-4">
      <details v-for="group in groups" :key="'indg'+group.id" class="group [&_summary::-webkit-details-marker]:hidden">
        <summary
          class="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 px-2 py-1 text-white"
          :class="['border-'+certificate.color, 'bg-'+certificate.color]"
        >
          <h2 class="text-lg font-medium">{{ group.code }} <!--<span class="bg-green-700 px-2">Activo</span>--></h2>
          <svg
            class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div>
          <div class="flex justify-end gap-2 py-1">
            <button 
              @click="openModalDelete(group.id)"
              class="bo-mini"
              :class="['bg-'+certificate.color]">
              <i class="fa-solid fa-trash"></i>
              Eliminar
            </button>
          </div>
          <table class="table-auto w-full">
            <thead>
              <tr>
                <th class="text-left">Inicio</th>
                <th class="text-left">Fin</th>
                <th class="text-left">Módulo</th>
                <th class="text-left">Diplomado</th>
                <th class="text-left">Profesor</th>
                <th class="text-left">Opciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300">
              <tr v-for="course in group.courses" :key="'indc'+course.id">
                <td class="py-1">{{ course.start_date }}</td>
                <td class="py-1">{{ course.end_date }}</td>
                <td class="py-1">{{ course.module.id }}</td>
                <td class="py-1">{{ course.module.name }}</td>
                <td class="py-1">{{ course.professor_id }}</td>
                <td class="py-1">
                  <button 
                    class="bo-mini"
                    :class="['bg-'+certificate.color]">
                    <i class="fa-solid fa-pen"></i>
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>
  </div>
  <div v-else>
    <p>{{ error }}</p>
  </div>  
  <SplashScreen :isLoadingSS="loading" />
  <ModalOptions v-model="modalAddGroup" title="Agregar Grupo">
    <div class="gap-4 mb-2">
      <div>
        <span class="whitespace-nowrap">Grupo</span>
        <input v-model="form.code" type="text" class="base-input-gray" placeholder="Ejemplo: 9041"/>
      </div>  
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
    <div class="flex justify-end gap-1">
      <button 
        @click="groupCourse()" 
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="success ? closeAndGetGroups(0) : closeModal(0)"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>
  </ModalOptions>
  <!--
  <ModalOptions v-model="modalCourse" title="Cursos">
    <div class="grid-max-3 gap-4 mb-2">
      <div>
        <span class="whitespace-nowrap">Profesor</span>
        <select
          :disabled="courseFlag == 0"
          v-model="form.professor_id"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un profesor</option>
          <option v-for="professor in professors" :value="professor.id" :key="'ind_'+professor.id">
            {{ professor.name }} {{ professor.last_name }}
          </option>
        </select>
      </div>
      <div>
        <span class="whitespace-nowrap">Módulo</span>
        <select
          :disabled="courseFlag == 0"
          v-model="form.module_id"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un módulo</option>
          <option v-for="module in modules" :value="module.id" :key="'ind'+module.id">
            {{ module.number }} - {{ module.name }}
          </option>
        </select>
      </div>
      <div>
        <span class="whitespace-nowrap">Grupo</span>
        <input v-model="form.group" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Fecha de Inicio</span>
        <input v-model="form.start_date" type="date" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Fecha de Termino</span>
        <input v-model="form.end_date" type="date" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Estatus</span>
        <select
          v-model="form.status"
          class="base-input-gray"
        >
          <option value="" disabled>Seleccione un estatus</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
    <div class="flex justify-end gap-1">
      <button 
        @click="createCourse()" 
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="closeModal(0)"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>
  </ModalOptions>
  -->
  <ModalOptions v-model="modalDeleteGroup" title="Eliminar Grupo">
    <div class="gap-4 mb-2">
      <p>Si elimina el grupo, todos los cursos se eliminarán tambien. ¿Desea Eliminar el grupo?</p>
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
    <div class="flex justify-end gap-1">
      <button 
        @click="deleteGroup()" 
        class="bcb-modal bg-sky-800">
        Eliminar
      </button>
      <button 
        @click="success ? closeAndGetGroups(2) : closeModal(2)"
        class="bcb-modal bg-sky-800">
        Aceptar
      </button>
    </div>
  </ModalOptions>
</template>

<script setup>
  import { onMounted, watch, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useTitleStore } from '@/stores/useTitleStore';
  import ModalOptions from '@/components/ModalOptions.vue';
  import axios from 'axios';

  const route = useRoute();
  const slug = route.params.slug;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpointCertificate = import.meta.env.VITE_CERTIFICATE;
  const endpointProfessors = import.meta.env.VITE_PROFESSORS;
  const endpointModules = import.meta.env.VITE_MODULES;
  const endpointCourses= import.meta.env.VITE_COURSES;
  const endpointGroups = import.meta.env.VITE_GROUPS;
  const titleStore = useTitleStore();
  const loading = ref(false);
  const modalDeleteGroup = ref(false);
  const modalAddGroup = ref(false);
  const certificate = ref(null);
  const course = ref(null);
  const groupId = ref(null);
  const success = ref(null);
  const error = ref(null);
  const professors = ref([]);
  const modules = ref([]);
  const groups = ref([]);
  const courseFlag = ref(0);
  const info = ref("");
  const form = ref({
    'certificate_id':'',
    'code':'',
  });

  watch(() => certificate.value, (newVal) => {
    if (newVal.name && newVal.color) {
      titleStore.setColorTitle(newVal.name, newVal.color);
    }
  });
  const searchCourse = async () => {
    alert(info.value);
  };
  const openModalCourse = (option) => {
    if (option==1) {
      courseFlag.value = option;
    }
    else {
      courseFlag.value = option;
      form.value.certificate_id = certificate.value.id;
      modalAddGroup.value = true;
    }
  };
  const openModalDelete = (id) => {
    groupId.value = id;
    modalDeleteGroup.value = true;
  }
  const closeModal = (option) => {
    if (option==1) {

    }
    else if (option==2) {
      modalDeleteGroup.value = false;
      error.value = null;
      success.value = null;
    }
    else {
      modalAddGroup.value = false;
      error.value = null;
      success.value = null;
      form.value.code = "";  
    }
  }
  const closeAndGetGroups = (option) => {
    if (option==1) {
      closeModal(1);
    }
    else if (option==2) {
      closeModal(2);
    }
    else{
      closeModal(0);
    }
    getGroupCourses();
  }
  const groupCourse = async () => {
    loading.value = true;
    error.value = null;
    success.value = null;

    const urlGroups = `${apiBaseUrl}${endpointGroups}`;
    const urlCourses = course.value ? `${apiBaseUrl}${endpointCourses}/${course.value.id}` : null;
    const method = courseFlag.value === 0 ? 'post' : 'put';
    const body = courseFlag.value === 0 ? form.value : records.value;
    const finalUrl = courseFlag.value === 0 ? urlGroups : urlCourses;

    try {
      const response = await axios[method](finalUrl, body, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status == 200) {
        success.value = response.data.message;
      }
    }
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los grupos';
    } 
    finally {
      loading.value = false;    
    }
  }
  //const getCoursesByStatus = async () => {};
  const getGroupCourses = async () => {
    const url = `${apiBaseUrl}${endpointGroups}-courses`;
    
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      groups.value = response.data;
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } finally {
      loading.value = false;
    }
  };
  const deleteGroup = async () => {
    const url = `${apiBaseUrl}${endpointGroups}/${groupId.value}`;
    
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status == 200) {
        success.value = response.data.message;
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar el diplomado';
    } finally {
      loading.value = false;
    }
  };

  // Init functions
  const getCertificate = async () => {
    const url = `${apiBaseUrl}${endpointCertificate}/${slug}`;
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      certificate.value = response.data;
      } catch (e) {
        error.value = e.response?.data?.message || 'Error al cargar el diplomado';
      } finally {
        loading.value = false;
      }
  };
  const getActiveProfessors = async () => {
    const url = `${apiBaseUrl}${endpointProfessors}`;
    try {
      const response = await axios.get(`${url}/by-status/1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      professors.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error consultar el profesor';
    }
  }
  const getModules = async () => {
    const url = `${apiBaseUrl}${endpointModules}`;
    try {
      const response = await axios.get(`${url}/by-certificate/${certificate.value.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      modules.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error consultar los módulos';
    }
  }
  onMounted(async () => {
    await getCertificate();
    getActiveProfessors();
    getModules();
  });
</script>
