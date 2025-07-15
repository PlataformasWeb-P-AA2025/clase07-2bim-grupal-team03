<template>
  <div class="estudiante-create-container">
    <h2>Agregar Nuevo Estudiante</h2>
    <form @submit.prevent="guardar">
      <label>Nombre:</label>
      <input v-model="estudiante.nombre" required />
      <label>Apellido:</label>
      <input v-model="estudiante.apellido" required />
      <label>Cédula:</label>
      <input v-model="estudiante.cedula" required />
      <label>Correo:</label>
      <input v-model="estudiante.correo" type="email" required />
      <button type="submit">Crear Estudiante</button>
    </form>
    <router-link to="/estudiantes" class="back-button"
      >Volver al listado</router-link
    >
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudianteCrear",
  data() {
    return {
      estudiante: {
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
      },
    };
  },
  methods: {
    async guardar() {
      await api.post("estudiantes/", this.estudiante);
      this.$router.push("/estudiantes");
    },
  },
};
</script>

<style scoped>
.estudiante-create-container {
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
  background-color: #28a745;
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
