<template>
  <header class="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-md">
    <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex-1 md:flex md:items-center md:gap-12">
          <a class="block" href="/">
            <span class="sr-only">Home</span>
            <img :src="logoPath" alt="Logo" class="h-14 w-auto">
          </a>
        </div>
        <div class="md:flex md:items-center md:gap-12">
          <nav aria-label="Global" class="hidden md:block">
            <ul class="flex items-center gap-6 text-md">
              <li>
                <a
                  class="text-gray-300 transition hover:text-white"
                  href="#"
                >
                  Profesores
                </a>
              </li>
              <li>
                <a
                  class="text-gray-300 transition hover:text-white"
                  href="#"
                >
                  Estadísticas
                </a>
              </li>
            </ul>
          </nav>
          <!-- Avatar y menú -->
          <div ref="userMenuRef" class="relative hidden md:block">
            <button
              @click="toggleUserMenu()"
              type="button"
              class="overflow-hidden rounded-full border border-gray-500 shadow-inner"
            >
              <span class="sr-only">Toggle dashboard menu</span>
              <img
                src="https://ui-avatars.com/api/?name=cris"
                alt=""
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
                <a
                  href="#"
                  class="block rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  role="menuitem"
                >
                  Perfil
                </a>
                <form method="POST" action="#">
                  <button
                    @click="closeUserMenu()"
                    type="submit"
                    class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300"
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
                </form>
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
</template>
<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';

  const logoPath = 'https://thor.fca.unam.mx/cedigec/cedigec/assets/img/logos/cedigec_s_trans.png';
  const userMenu = ref(false);
  const userMenuRef = ref(null);
  const mobileUserMenu = ref(false);
  const mobileUserMenuRef = ref(null);

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

  const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      userMenu.value = false;
    }
    if (mobileUserMenuRef.value && !mobileUserMenuRef.value.contains(event.target)) {
    mobileUserMenu.value = false;
  }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });

</script>