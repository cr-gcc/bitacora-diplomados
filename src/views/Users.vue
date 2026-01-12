<template>
  <div class="bg-gray-300 px-4 py-2">
    <div class="my-1">
      <div class="flex gap-2 items-center justify-end">
        <button
          @click="openModal('roles-and-permissions', null)"
          class="bo-mini mb-1 bg-sky-900">
          <i class="fa-solid fa-users-gear mr-0.5"></i>
          Roles y Permisos
        </button> 
        <button 
          @click="openModal('add', null)"
          class="bo-mini mb-1 bg-sky-900">
          <i class="fa-solid fa-user-plus mr-0.5"></i>
          Agregar
        </button>
      </div>
    </div>
    <div v-if="users.length>0" class="overflow-x-auto">
      <table class="table-auto w-full min-w-max">
        <thead class="text-center">
          <tr>
            <th class="px-1">Rol</th>
            <th class="px-1">Nombre</th>
            <th class="px-1">Apellidos</th>
            <th class="px-1">Email</th>
            <th class="px-1">Contraseña</th>
            <th class="px-1">Opciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300 text-center">
          <tr class="border-b border-gray-100" v-for="(user, index) in users" :key="user.id">
            <td class="px-1 pt-1">{{ user.role }}</td>
            <td class="px-1 pt-1">{{ user.name }}</td>
            <td class="px-1 pt-1">{{ user.last_name }}</td>
            <td class="px-1 pt-1">{{ user.email }}</td>
            <td class="px-1 pt-1">**********</td>
            <td class="px-1 pt-1">
              <div class="flex justify-center items-center gap-2">
                <button
                  @click="openModal('edit', user)"
                  class="bo-mini mb-1 bg-sky-900">
                  <i class="fa-solid fa-pen mr-0.5"></i>
                  Editar
                </button>
                <button
                  @click="openModal('reset-password', {id: user.id})"
                  class="bo-mini mb-1 bg-sky-900">
                  <i class="fa-solid fa-unlock mr-0.5"></i>
                  Resetear Contraseña
                </button>
              </div>
            </td>
            <!--
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
            -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Add v-model="isOpenAddModal" @refresh="getUsers()"/>
  <Edit 
    v-model="isOpenEditModal"
    :user="user"
    @refresh="getUsers()"
  />
  <ResetPassword 
    v-model="isOpenResetPasswordModal" 
    :user="user" 
    @refresh="getUsers()"
  />
  <RolesAndPermissions v-model="isOpenRolesAndPermissionsModal"/>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { useAppStore } from '@/stores/useAppStore';
  import { usePageThemeStore } from '@/stores/usePageThemeStore';
  import Add from '@/components/modals/user/Add.vue';
  import RolesAndPermissions from '@/components/modals/user/RolesAndPermissions.vue';
  import Edit from '@/components/modals/user/Edit.vue';
  import ResetPassword from '@/components/modals/user/ResetPassword.vue';
  import api from '@/plugins/axios';
    //  Variables
  const pageThemeStore = usePageThemeStore(); 
  const app = useAppStore();
  const isOpenAddModal = ref(false);
  const isOpenEditModal = ref(false);
  const isOpenResetPasswordModal = ref(false);
  const isOpenRolesAndPermissionsModal = ref(false);
  const users = ref([]);
  const user = ref({});
  const error = ref('');

  pageThemeStore.setPageTheme('Usuarios', 'sky-900');
  //  Funciones
  const openModal = (option, data) => {
    switch (option) {
      case 'add':
        isOpenAddModal.value = true;
        break;
      case 'edit':
        isOpenEditModal.value = true;
        break;
      case 'reset-password':
        isOpenResetPasswordModal.value = true;
        user.value = data;
        break;
      case 'roles-and-permissions':
        isOpenRolesAndPermissionsModal.value = true;
        break;
      default:
        break;
    }
  };
  const getUsers = async () => {
    app.loadingApp = true;
    error.value = null;
    //
    const url = import.meta.env.VITE_PROFILES;
    //
    try {
      const response = await api.get(url);
      if (response.status === 200) {
        users.value = response.data;
      }
      else {
        error.value = response.data.message;
      }
    } 
    catch (e) {
      error.value = e.response.data.message || 'Error al obtener los usuarios.';
    } 
    finally {
      app.loadingApp = false;
    }
  };
  //  Hooks
  onMounted(async () => {
    await getUsers();
  });
</script>
