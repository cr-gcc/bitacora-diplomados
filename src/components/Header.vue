<template>
  <header class="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-md">
    <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex-1 md:flex md:items-center md:gap-12">
          <img :src="logoPath" alt="Logo" class="h-14 w-auto">
        </div>
        <div class="md:flex md:items-center md:gap-12">
          <nav aria-label="Global" class="hidden md:block">
            <ul class="flex items-center gap-6 text-md">
              <li>
                <RouterLink :to="'/diplomados'" class="text-gray-300 transition hover:text-white"
                >
                  Diplomados
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="'/profesores'" class="text-gray-300 transition hover:text-white"
                >
                  Profesores
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="'/estadisticas'" class="text-gray-300 transition hover:text-white"
                >
                  Estadisticas
                </RouterLink>
              </li>
            </ul>
          </nav>
          <!-- Avatar y menú -->
          <div ref="userMenuRef" class="relative hidden md:block">
            <button
              @click="toggleUserMenu()"
              type="button"
              class="cursor-pointer overflow-hidden rounded-full border border-gray-500 shadow-inner"
            >
              <span class="sr-only">Toggle dashboard menu</span>
              <img
               :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.name || 'Usuario')}`"
                alt="Usuario"
                class="size-10 object-cover"
              />
            </button>
            <!-- Menú desplegable -->
            <div
              v-if="userMenu"
              class="absolute end-0 z-10 mt-0.5 w-56 rounded-md border border-gray-600 bg-gray-800 shadow-lg"
              role="menu"
            >
              <div class="p-2">
                <div>
                  <button
                    @click="openModalEdit()"
                    class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                    role="menuitem"
                  >
                    Mi Perfil
                  </button>
                </div>
                <div v-if="auth.user.roles[0].name == 'admin'">
                  <RouterLink :to="'/usuarios'"
                    class="block rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    role="menuitem"
                  >
                    Usuarios
                  </RouterLink>
                </div>
                <div>
                  <button
                    @click="logout()"
                    class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 cursor-pointer"
                    role="menuitem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Botón móvil -->
          <div ref="mobileUserMenuRef" class="block md:hidden">
            <button
              class="rounded-sm bg-gray-700 p-2 text-gray-300 transition hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <!-- Menú móvil -->
            <div
              v-if="mobileUserMenu"
              class="absolute right-0 z-10 mt-2 w-48 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
            >
              <ul class="p-2 space-y-2 text-sm">
                <li>
                  <a href="#" class="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50" @click="closeMobileUserMenu()">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" class="block rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-50" @click="closeMobileUserMenu()">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <ModalOptions v-model="modalEdit" title="Perfil">
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
        @click="closeModalEdit()"
        class="bcb-modal bg-sky-800">
        Salir
      </button>
    </div>
  </ModalOptions>
  <SplashScreen :isLoadingSS="loading" />
</template>
<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/useAuthStore';
  import ModalOptions from '@/components/ModalOptions.vue';
  import api from '@/plugins/axios';

  const logoPath = 'https://thor.fca.unam.mx/cedigec/cedigec/assets/img/logos/cedigec_s_trans.png';
  const endpoint = import.meta.env.VITE_PROFILES;
  const auth = useAuthStore();
  const router = useRouter();
  const userMenu = ref(false);
  const modalEdit = ref(false);
  const mobileUserMenu = ref(false);
  const loading = ref(false);
  const success = ref(null);
  const error = ref(null);
  const userMenuRef = ref(null);
  const userId = ref(null);
  const mobileUserMenuRef = ref(null);
  const formUser = ref({
    'name':'',
    'last_name':'',
    'email':''
  });

  //  Functions
  const toggleUserMenu = () => {
    userMenu.value = !userMenu.value;
  };
  const toggleMobileUserMenu = () => {
    mobileUserMenu.value = !mobileUserMenu.value;
  };
  const closeUserMenu = () => {
    userMenu.value = false;
  };
  const closeMobileUserMenu = () => {
    mobileUserMenu.value = false;
  };
  const handleClick = (event) => {
    const menu = userMenuRef.value;
    if (!menu) return;
    if (!menu.contains(event.target)) {
      userMenu.value = false;
    }

    const dropdown = menu.querySelector('[role="menu"]');
    if (dropdown && dropdown.contains(event.target)) {
      userMenu.value = false;
    }
  };
  const openModalEdit = async () => {
    loading.value = true;
    const url = '/me';
    try {
      const response = await api.get(url);
      if (response.status == 200) {
        userId.value = response.data.id;
        formUser.value.name = response.data.name;
        formUser.value.last_name = response.data.last_name;
        formUser.value.email = response.data.email;
        modalEdit.value = true;
      }
      else {
        alert("No se pudo consultar el perfil del usuario. Intentelo más tarde.");
      }
    } 
    catch (e) {
      alert("Error al consultar el perfil del usuario.");
    } 
    finally {
      loading.value = false;
    }
  }
  const editUser = async () => {
    loading.value = true;
    const url = `${endpoint}/${userId.value}`;
    try {
      const response = await api.put(url, formUser.value);
      if (response.status == 200) {
        success.value = response.data.message;
      }
      else {
        error.value = "Error al actualizar el perfil del usuario.";
      }
    }
    catch (e) {
      error.value = e.response?.data?.message ||
      'Ha ocurrido un error en el sistema. por favor intentelo más tarde.';
    } 
    finally {
      loading.value = false;
    }
  }
  const closeModalEdit = () => {
    modalEdit.value = false;
    userId.value = null;
    success.value = null;
    error.value = null;
    formUser.value.name = '';
    formUser.value.last_name = '';
    formUser.value.email = '';
  }
  const logout = async () => {
    try {
      loading.value = true;
      await api.post('/logout');
    } 
    catch (error) {
      console.warn('Error al hacer logout en API', error);
    } 
    finally {
      loading.value = false;
      auth.logout();
      router.push('/login');
    }
  }
  
  //  Hooks
  onMounted(() => {
    document.addEventListener("click", handleClick);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClick);
  });
  
</script>