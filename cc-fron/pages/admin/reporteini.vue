<template>
    <v-data-table style="background-color: #FFF9C4" :headers="headers" :items="items" sort-by="id" class="elevation-5">
      <template v-slot:top>
        <v-toolbar color="primary" dark flat><v-toolbar-title>Inicios de sesión</v-toolbar-title></v-toolbar>
      </template>
      <template v-slot:item.createdAt="{ item }">{{ fecha_hora(item.createdAt) }}</template>
    </v-data-table>
  </template>
  
  <script>
  export default {
    layout: 'default',
    data: () => ({ headers: [{ text: 'Correo', value: 'email' }, { text: 'Fecha y Hora', value: 'createdAt' }], items: [] }),
    async created() { const { data } = await this.$axios.get('api/inisesion'); this.items = data; },
    methods: { fecha_hora(val) { const d = new Date(val); return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`; } }
  };
  </script>