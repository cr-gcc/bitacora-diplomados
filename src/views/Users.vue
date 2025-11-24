<template>
  <div class="bg-gray-300 px-4 py-2">
    <div class="my-1">
      <div class="flex flex-col items-end">
        <button 
          @click="openModalAdd()"
          class="bo-mini mb-1 bg-sky-900">
          <i class="fa-solid fa-user-plus mr-0.5"></i>
          Agrear Usuario
        </button>
      </div>
    </div>
    <div v-if="users.length>0" class="overflow-x-auto">
      <table class="table-auto w-full min-w-max">
        <thead class="text-center">
          <tr>
            <th class="px-1">Nombre</th>
            <th class="px-1">Apellidos</th>
            <th class="px-1">Email</th>
            <th class="px-1">Contraseña</th>
            <th class="px-1">Opciones</th>
            <th class="px-1">Accesibilidad</th>
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
              </div>
            </td>
            <td class="px-1 pt-1">
              <div class="flex flex-col items-center">
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
  <ModalOptions 
    :title="userFlag ? 'Editar Perfil' : 'Agregar Usuario'"
    v-model="modalAddEdit"
  >
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
        @click="addEditUser()"
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
      <div v-for="role in allRoles" :key="role.id" class="flex items-center gap-2">
        <input
          type="radio"
          :value="role.id"
          v-model="selectedRole"
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
  <ModalOptions v-model="modalPermissions" title="Permisos">
    <div class="grid-max-4 gap-4 mb-2">
      <div
        v-for="permission in allPermissions"
        :key="permission.id"
        class="flex items-center gap-2"
      >
        <input
          type="checkbox"
          :value="permission.id"
          v-model="selectedPermissions"
          class="rounded text-blue-600 focus:ring-blue-500"
        />
        <span class="whitespace-nowrap">
          {{ permission.name }}
        </span>
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
        @click="editPermission()"
        class="bcb-modal bg-sky-800">
        Guardar
      </button>
      <button 
        @click="success ? closeAndGetUsers(3) : closeModal(3)"
        class="bcb-modal bg-sky-800">
        Salir
      </button>
    </div>
  </ModalOptions>
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import { useAppStore } from '@/stores/useAppStore';
  import { useTitleStore } from '@/stores/useTitleStore';
  import ModalOptions from '@/components/ModalOptions.vue';
  import api from '@/plugins/axios';

  const app = useAppStore();
  const titleStore = useTitleStore();
  const endpoint = import.meta.env.VITE_PROFILES;
  const password = import.meta.env.VITE_GENERAL_PASS;
  const userFlag = ref(0);
  const modalAddEdit = ref(false);
  const modalRoles = ref(false);
  const modalPermissions = ref(false);
  const success = ref(null);
  const error = ref(null);
  const userId = ref(null);
  const selectedRole = ref(null);
  const selectedPermissions = ref([]);
  const users = ref([]);
  const allRoles = ref([]);
  const allPermissions = ref([]);
  const formUser = ref({
    'name':'',
    'last_name':'',
    'email':''
  });

  titleStore.setColorTitle('Usuarios', 'sky-900');
  
  //  Functions
  const openModalAdd = () => {
    setFormUser();
    userFlag.value = 0;
    modalAddEdit.value = true;
  }
  const openModalEdit = (index) => {
    setFormUser();
    const user = getUser(index);
    userFlag.value = 1;
    formUser.value.name = user.name;
    formUser.value.last_name = user.last_name;
    formUser.value.email = user.email;
    modalAddEdit.value = true;
  }
  const openModalRoles = (index) => {
    const user = getUser(index);
    selectedRole.value = user.roles.length > 0 ? user.roles[0].id : null;
    modalRoles.value = true;
  }
  const openModalPermissions = (index) => {
    const user = getUser(index);
    const userPerms = user.permissions || [];
    selectedPermissions.value = userPerms.map(p => p.id);
    modalPermissions.value = true;
  }
  const closeModal = (option) => {
    setInitValues(0);
    if (option==1) {
      modalAddEdit.value = false;
      setFormUser();
    }
    else if (option==2) {
      selectedRole.value = null;
      modalRoles.value = false;
    }
    else{
      selectedPermissions.value = null;
      modalPermissions.value = false;
    }
  }
  const closeAndGetUsers = (option) => {
    closeModal(option);
    getProfiles();
  }
  const addEditUser = async () => {
    setInitValues(1);
    const body = formUser;
    const method = userFlag.value==0 ? 'post' : 'put';
    const url = userFlag.value==0 ? `${endpoint}` : `${endpoint}/${userId.value}`;

    userFlag.value==0 ? body.value.password=password : "" ; 
    
    try {
      const response = await api[method](url, body.value);
      if (response.status == 200) {
        success.value = response.data.message;
      }
      else {
        error.value = userFlag.value==0 ? 
        "Error al agregar el usuario." : 
        "Error al actualizar el perfil.";
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message ||
      'Ha ocurrido un error en el sistema. por favor intentelo más tarde.';
    } 
    finally {
      app.loadingApp = false;
    }
  }
  const editRole = async () => {
    setInitValues(1);
    const form = ref({
      'user_id':userId.value,
      'role_id':selectedRole.value
    })
    const url = `${endpoint}/update-role`;
    try {
      const response = await api.post(url, form.value);
      if (response.status == 200) {
        success.value = response.data.message;
      }
      else {
        error.value = "Error al actualizar el rol del usuario.";
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar editar el perfil.';
    } 
    finally {
      app.loadingApp = false;
    }
  }
  const editPermission = async () => {
    setInitValues(1);
    const form = ref({
      'user_id':userId.value,
      'permissions_id':selectedPermissions.value
    })
    const url = `${endpoint}/update-permissions`;
    try {
      const response = await api.post(url, form.value);
      if (response.status == 200) {
        success.value = response.data.message;
      }
      else {
        error.value = "Error al actualizar los permisos del usuario.";
      }
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar editar el perfil.';
    } 
    finally {
      app.loadingApp = false;
    }
  }

  //  Setters
  const setFormUser = () => {
    userId.value = null;
    formUser.value.name = "";
    formUser.value.last_name = "";
    formUser.value.email = "";
  }
  const setInitValues = (option) => {    
    app.loadingApp = option==1 ? true : false;
    error.value = null;
    success.value = null;
  }
  //  Getters
  const getUser = (index) => {
    const user = users.value[index];
    userId.value = user.id;
    return user;
  }

  //  Init functions
  const getProfiles = async () => {
    setInitValues(1);
    const url = `${endpoint}`;
    try {
      const response = await api.get(url);
      users.value = response.data.users;
      allRoles.value = response.data.roles;
      allPermissions.value = response.data.permissions;
    } 
    catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar los perfiles';
    } 
    finally {
      app.loadingApp = false;
    }
  } 

  //  Hooks
  onMounted(async () => {
    await getProfiles();
  });
</script>