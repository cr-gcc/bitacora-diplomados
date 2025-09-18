<template>
  <h3 class="text-3xl text-red-700 font-semibold mb-2">Fechas Promesa Venta</h3>
  <div class="bg-gray-100 flex justify-center h-screen">
    <div class="w-full mx-auto p-4">
      <div class="bg-white shadow-lg overflow-hidden">
        <div class="flex items-center justify-between px-6 py-3 bg-red-700">
          <button @click="prevMonth()" class="text-white cursor-pointer">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <h2 class="text-white">{{ monthName }} {{ year }}</h2>
          <button @click="nextMonth()" class="text-white cursor-pointer">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div class="grid grid-cols-7 gap-2 p-4">
          <div class="text-center font-semibold" v-for="(day, index) in daysOfWeek" :key="'dow-' + index">
            {{ day }}
          </div>
          <div v-for="n in firstDayOfWeek" :key="'empty-' + n"></div>
          <template v-for="day in daysInMonth" :key="'day-'+day">
            <div v-if="isPromiseDate(day)" class="calendar-frame bg-gray-800 text-white cursor-pointer" @click="selectDate(day)">
              {{ day }}
            </div>
            <div v-else-if="isToday(day)" class="calendar-frame bg-red-600 text-white" >
              {{ day }}
            </div>
            <div v-else class="calendar-frame text-red-600">
              {{ day }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <ModalMsg :modalMsg="showModal" :modalMsgTitle="titleModal" @close="showModal=false">
    <div class="mb-2">
      <p>
        <span class="font-semibold">Campaña:</span> Nomina
      </p>
      <p>
        <span class="font-semibold">Responsable:</span> Carlos Hernandez
      </p>
      <p>
        <span class="font-semibold">Fecha de venta:</span> 5/06/2025
      </p>
      <div class="pt-1 border-b-2 border-red-800"></div>
    </div>
    <div class="mb-2">
      <p>
        <span class="font-semibold">Campaña:</span> Nomina
      </p>
      <p>
        <span class="font-semibold">Responsable:</span> Marco Luna
      </p>
      <p>
        <span class="font-semibold">Fecha de venta:</span> 5/06/2025
      </p>
      <div class="pt-1 border-b-2 border-red-800"></div>
    </div>
    <div class="mb-4">
      <p>
        <span class="font-semibold">Campaña:</span> Nomina
      </p>
      <p>
        <span class="font-semibold">Responsable:</span> Maria Delgado
      </p>
      <p>
        <span class="font-semibold">Fecha de venta:</span> 5/06/2025
      </p>
      <div class="pt-1 border-b-2 border-red-800"></div>
    </div>
  </ModalMsg>
</template>
<script setup>
  import { ref, computed } from 'vue'

  const currentDate = new Date();
  const year = ref(currentDate.getFullYear());
  const month = ref(currentDate.getMonth());
	/*
	const day = String(currentDate.getDate()).padStart(2, '0');
	const formattedDate = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${day}`;
	*/
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  /*const selectedDate = ref(null);*/
  const showModal = ref(false);
  const titleModal = ref("Ventas");
  //const isModalOpen = ref(false);

  const firstDayOfWeek = computed(() => {
    return new Date(year.value, month.value, 1).getDay()
  });

  const daysInMonth = computed(() => {
    return new Date(year.value, month.value + 1, 0).getDate()
  });

  const monthName = computed(() => {
    return new Date(year.value, month.value).toLocaleString('default', { month: 'long' })
  });

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month.value === today.getMonth() &&
      year.value === today.getFullYear()
    )
  };
	// V1
  const isPromiseDate = (day) => {
		const reg = [
			{ date: '2025-09-11' },
			{ date: '2025-09-22' },
			{ date: '2025-09-25' }
		];
		// convertimos cada string en Date
		const dates = reg.map(r => new Date(r.date));
		//
    return dates.some(date =>
      day === date.getDate() &&
      month.value === date.getMonth() &&
      year.value === date.getFullYear()
    );
  };
	/* V2
		const isPromiseDate = (day) => {
			const reg = [
				{ id: 1, date: '2025-09-11' },
				{ id: 2, date: '2025-09-22' },
				{ id: 3, date: '2025-09-25' },
			];
			// construimos la fecha que recibimos
			const checkDate = new Date(year.value, month.value, day); 
			const formatted = checkDate.toISOString().split("T")[0]; // yyyy-mm-dd
			// buscamos si existe en reg
			const found = reg.find(r => r.date === formatted);
			return found ? found.id : 0;
		};
	*/
	const selectDate = (day) => {
		const formattedDate = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${day}`;
		//alert(formattedDate);
    showModal.value = true;
  };
  /*
    const selectedDateFormatted = computed(() => {
      if (!selectedDate.value) return ''
      return selectedDate.value.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    })
  */
  const prevMonth = () => {
    month.value--
    if (month.value < 0) {
      month.value = 11
      year.value--
    }
  }

  const nextMonth = () => {
    month.value++
    if (month.value > 11) {
      month.value = 0
      year.value++
    }
	}
</script>
