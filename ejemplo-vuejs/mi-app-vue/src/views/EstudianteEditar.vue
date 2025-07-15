<template>
  <div class="estudiante-edit-container">
    <h2>Editar Estudiante</h2>
    <form v-if="estudiante" @submit.prevent="guardar">
      <label>Nombre:</label>
      <input v-model="estudiante.nombre" required />
      <label>Apellido:</label>
      <input v-model="estudiante.apellido" required />
      <label>Cédula:</label>
      <input v-model="estudiante.cedula" required />
      <label>Correo:</label>
      <input v-model="estudiante.correo" required />
      <button type="submit">Guardar Cambios</button>
    </form>
    <p v-else>Cargando estudiante...</p>
    <router-link to="/estudiantes" class="back-button">Volver</router-link>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudianteEditar",
  props: ["estudianteUrl"],
  data() {
    return {
      estudiante: null,
    };
  },
  async created() {
    const url = decodeURIComponent(this.estudianteUrl);
    const res = await api.get(url);
    this.estudiante = res.data;
  },
  methods: {
    async guardar() {
      await api.put(this.estudiante.url, this.estudiante);
      this.$router.push("/estudiantes");
    },
  },
};
</script>

<style scoped>
.estudiante-edit-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fefefe;
  border: 1px solid #ccc;
  border-radius: 8px;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 5px;
}
.back-button {
  margin-top: 15px;
  display: inline-block;
  color: #007bff;
}
</style>
