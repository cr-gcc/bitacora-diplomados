<template>
  <div v-if="users.length>0" class="bg-gray-300 px-4 py-2">
    <div class="overflow-x-auto">
      <table class="table-auto w-full min-w-max">
        <thead class="text-center">
          <tr>
            <th class="px-1">Nombre</th>
            <th class="px-1">Apellidos</th>
            <th class="px-1">Email</th>
            <th class="px-1">Contraseña</th>
            <th class="px-1">Opciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300 text-center">
          <tr class="border-b border-gray-100" v-for="(user, index) in users" :key="user.id">
            <td class="px-1 pt-1">{{ user.name }}</td>
            <td class="px-1 pt-1">{{ user.last_name }}</td>
            <td class="px-1 pt-1">{{ user.email }}</td>
            <td class="px-1 pt-1">**********</td>
            <td class="px-1 pt-1">
              <div class="flex flex-col items-center">
              <button 
                @click="openModalEdit(index)"
                class="bo-mini mb-1 bg-sky-900">
                <i class="fa-solid fa-pen mr-0.5"></i>
                Editar
              </button>
              <button 
                @click="openModalRoles(index)"
                class="bo-mini mb-1 bg-sky-900">
                <i class="fa-solid fa-users-gear mr-0.5"></i>
                Roles
              </button>
              <button 
                @click="openModalPermissions(index)"
                class="bo-mini mb-1 bg-sky-900">
                <i class="fa-solid fa-list-check mr-0.5"></i>
                Permisos
              </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  {{ roleSelected }}
  <ModalOptions v-model="modalEdit" title="Editar Perfil">
    <div class="grid-max-3 gap-4 mb-2">
      <div>
        <span class="whitespace-nowrap">Nombre</span>
        <input v-model="formUser.name" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Apellidos</span>
        <input v-model="formUser.last_name" type="text" class="base-input-gray"/>
      </div>
      <div>
        <span class="whitespace-nowrap">Email</span>
        <input v-model="formUser.email" type="email" class="base-input-gray"/>
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
        @click="editUser()"
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="success ? closeAndGetUsers(1) : closeModal(1)"
        class="bcb-modal bg-sky-800">
        Salir
      </button>
    </div>
  </ModalOptions>
  <ModalOptions v-model="modalRoles" title="Roles">
    <div class="grid-max-3 gap-4 mb-2">
      <div v-for="role in roles" :key="role.id" class="flex items-center gap-2">
      <input
        type="radio"
        :value="role.id"
        v-model="roleSelected"
        name="role"
      />
      <span class="whitespace-nowrap">{{ role.name }}</span>
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
        @click="editRole()"
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="success ? closeAndGetUsers(2) : closeModal(2)"
        class="bcb-modal bg-sky-800">
        Salir
      </button>
    </div>
  </ModalOptions>
  <ModalOptions v-model="modalPermissions" title="Editar Perfil">
    <div class="grid-max-2 gap-4 mb-2">
    </div>
    <div v-if="error" class="mt-2 mb-1">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-if="success" class="mt-2 mb-1">
      <p class="text-lime-700">{{ success }}</p>
    </div>
  </ModalOptions>
  <SplashScreen :isLoadingSS="loading" />
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import { useTitleStore } from '@/stores/useTitleStore';
  import ModalOptions from '@/components/ModalOptions.vue';
  import axios from 'axios';

  const titleStore = useTitleStore();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const endpoint = import.meta.env.VITE_PROFILES;
  const modalEdit = ref(false);
  const modalRoles = ref(false);
  const modalPermissions = ref(false);
  const loading = ref(false);
  const success = ref(null);
  const error = ref(null);
  const userId = ref(null);
  const roleSelected = ref(null);
  const users = ref([]);
  const roles = ref([]);
  const permissions = ref([]);
  const formUser = ref({
    'name':'',
    'last_name':'',
    'email':''
  });
  titleStore.setColorTitle('Perfiles', 'sky-900');
  
  //  Functions
  const openModalEdit = (index) => {
    const user = users.value[index];
    userId.value = user.id;
    formUser.value.name = user.name;
    formUser.value.last_name = user.last_name;
    formUser.value.email = user.email;
    modalEdit.value = true;
  }
  const openModalRoles = (index) => {
    const user = users.value[index];
    userId.value = user.id;
    roleSelected.value = user.roles.length > 0 ? user.roles[0].id : null;
    modalRoles.value = true;
  }
  const openModalPermissions = (index) => {
    alert(index);
  }
  const closeModal = (option) => {
    setInitValues(0);
    if (option==1) {
      modalEdit.value = false;
      setFormUser();
    }
    else if (option==2) {
      roleSelected.value = null;
      modalRoles.value = false;
    }
  }
  const closeAndGetUsers = (option) => {
    closeModal(option);
    getProfiles();
  }
  const editUser = async () => {
    setInitValues(1);
    const url = `${apiBaseUrl}${endpoint}/${userId.value}`;
    try {
      const response = await axios.put(url, formUser.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
      if (response.status == 200) {
        success.value = response.data.message;
      }
      else {
        error.value = "Error al actualizar el perfil.";
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar editar el perfil.';
    } 
    finally {
      loading.value = false;
    }
  }

  const editRole = async () => {
    setInitValues(1);
    const form = ref({
      'user_id':userId.value,
      'role_id':roleSelected.value
    })
    const url = `${apiBaseUrl}${endpoint}/update-role`;
    try {
      const response = await axios.post(url, form.value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });
      if (response.status == 200) {
        success.value = response.data.message;
      }
      else {
        error.value = "Error al actualizar el perfil.";
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar editar el perfil.';
    } 
    finally {
      loading.value = false;
    }
  }

  const setFormUser = () => {
    userId.value = null;
    formUser.value.name = "";
    formUser.value.last_name = "";
    formUser.value.email = "";
  }
  const setInitValues = (option) => {    
    loading.value = option==1 ? true : false;
    error.value = null;
    success.value = null;
  }

  //  Init functions
  const getProfiles = async () => {
    setInitValues(1);
    const url = `${apiBaseUrl}${endpoint}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      users.value = response.data.users;
      roles.value = response.data.roles;
      permissions.value = response.data.permissions;
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los perfiles';
    } 
    finally {
      loading.value = false;
    }
  } 

  onMounted(async () => {
    await getProfiles();
  });
</script>