<template>
  <div class="grid-max-5 gap-4 mb-4">
    <div>
      <input
        type="text"
        placeholder="Buscar"
        class="w-full rounded px-2 py-1 border border-sky-900"
        v-model="info"
        @keyup.enter="searchProfessor()"
      />
    </div>
    <div>
      <button 
        @click="getProfessorsByStatus(0)"
        class="bcb-certificate border-sky-900 bg-sky-900">
        Inactivos
      </button>
    </div>
    <div>
      <button
        @click="getProfessorsByStatus(1)" 
        class="bcb-certificate border-sky-900 bg-sky-900">
        Activos
      </button>
    </div>
    <div>
      <button
        @click="getAllProfessors()" 
        class="bcb-certificate border-sky-900 bg-sky-900">
        Todos
      </button>
    </div>
    <div>
      <button
        @click="openModal('add', 0)" 
        class="bcb-certificate border-sky-900 bg-sky-900">
        Agregar
      </button>
    </div>
  </div>
  <div v-if="error" class="mt-2 mb-1">
    <p class="text-red-700">{{ error }}</p>
  </div>
  <div v-if="professors.length>0" class="bg-gray-300 px-4 py-2 text-sm">
    <div class="overflow-x-auto">
      <table class="table-auto w-full min-w-max">
        <thead class="text-left">
          <tr>
            <th class="px-1 font-bold">#</th>
            <th class="px-1">Nombre</th>
            <th class="px-1">Apellidos</th>
            <th class="px-1">Email</th>
            <th class="px-1">RFC</th>
            <th class="px-1">Usuario</th>
            <th class="px-1">Contraseña</th>
            <th class="px-1">Estatus</th>
            <th class="px-1">Opciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          <tr v-for="(prof, ind) in professors" :key="'prof'+ind">
            <td class="font-bold">{{ ind+1 }}</td>
            <td class="px-1">{{ prof.name }}</td>
            <td class="px-1">{{ prof.last_name }}</td>
            <td class="px-1">{{ prof.email }}</td>
            <td class="px-1">{{ prof.rfc }}</td>
            <td class="px-1">{{ prof.user }}</td>
            <td class="px-1">{{ prof.password }}</td>
            <td class="px-1">
              <i class="fa-solid fa-circle" :class="prof.active ? 'text-lime-600' : 'text-red-700'"></i>
            </td>
            <td class="px-1">
              <button 
                class="bo-mini mb-1 bg-sky-900" 
                @click="getProfessorInArray(prof.id)">
                  <i class="fa-solid fa-pen mr-0.5"></i>
                Editar
              </button>
            </td>
          </tr> 
        </tbody> 
      </table>
    </div>
  </div>
  <Add 
    v-model="openAddModal" 
    @refresh="getAllProfessors()"
  />
  <Edit 
    v-model="openEditModal" 
    :professor="professor" 
    @refresh="getAllProfessors()"
  />
</template>
<script setup>
  import { ref } from 'vue'; 
  import { useAppStore } from '@/stores/useAppStore';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import Add from '@/components/modals/professor/Add.vue';
  import Edit from '@/components/modals/professor/Edit.vue';
  import api from '@/plugins/axios';

  const endpoint = import.meta.env.VITE_PROFESSORS;
  const app = useAppStore();
  const pageThemeStore = usePageThemeStore();
  const openAddModal = ref(false);
  const openEditModal = ref(false);
  const error = ref(null);
  const success  = ref(null);
  const professor = ref(null);
  const professors = ref([]);
  const info = ref("");

  pageThemeStore.setPageTheme('Profesores', 'sky-900');

  const openModal = (option, id) => {
    if (option == 'add') {
      openAddModal.value = true;
    }
    else if (option == 'edit') {
      openEditModal.value = true;
    }
  };

  const getAllProfessors = async () => {
    setInitValues(1);
    professors.value = [];
    const url = `${endpoint}`;
    
    try {
      const response = await api.get(url);
      professors.value = response.data; 
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los profesores';
    } finally {
      app.loadingApp = false;
    }
  };

  const getProfessorInArray = async (id) => {
    professor.value = null;
    let selectedProfessor = professors.value.find(p => p.id === id);
    if (selectedProfessor) {
      professor.value = selectedProfessor;
      openEditModal.value = true;
    } 
    else {
      getProfessor(id);
    }
  };

  const getProfessor = async (id) => {
    setInitValues(1);
    const url = `${endpoint}/${id}`;

    try {
      const response = await api.get(url);
      if (response.status == 200) {
        if (response.data.length>0) {
          professors.value = response.data; 
        }
        else {
          error.value = "No se encontraron registros con este parámetro.";
        }
      } 
      else {
        error.value = "Error de busqueda de profesor.";
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error consultar el profesor';
    } finally {
      app.loadingApp = false;
    }
  };

  const getProfessorsByStatus = async (status) => {
    setInitValues(1);
    const url = `${endpoint}/by-status/${status}`;

    try {
      const response = await api.get(url);
      if (response.status == 200) {
        if (response.data.length>0) {
          professors.value = response.data; 
        }
        else {
          const msg = status==0 ? 'Inactivo' : 'Activo' ;
          error.value = `No se encontraron registros con el estatus "${msg}"`;
        }
      }
      else {
        error.value = "Error";
      }
    } catch (e) {
      error.value = e.response?.data?.message || 'Error consultar el profesor';
    } finally {
      app.loadingApp = false;
    }
  };

  const searchProfessor = async () => {
    setInitValues(1);
    professors.value = [];
    const url = `${endpoint}/search`;
    const body = {info:info.value};

    try {
      const response = await api.post(url, body);
      if (response.status == 200) {
        if (response.data.length>0) {
          professors.value = response.data; 
        }
        else {
          error.value = "No se encontraron registros con este parámetro.";
        }
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al buscar profesores';
    } 
    finally {
      app.loadingApp = false;    
    }
  };

  const setInitValues = (option) => {    
    app.loadingApp = option==1 ? true : false;
    error.value = null;
    success.value = null;
  }

</script>