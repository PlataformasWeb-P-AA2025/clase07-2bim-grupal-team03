<template>
  <div class="telefono-detail-container">
    <h2>Editar Teléfono</h2>
    <p v-if="loading">Cargando teléfono...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <form v-if="telefono" @submit.prevent="guardar">
      <label>Teléfono:</label>
      <input v-model="telefono.telefono" type="text" />
      <label>Tipo:</label>
      <input v-model="telefono.tipo" type="text" />
      <label>ID Estudiante:</label>
      <input v-model="telefono.estudiante" type="text" />
      <button type="submit">Guardar</button>
    </form>
    <router-link to="/telefonos" class="back-button"
      >Volver al listado</router-link
    >
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "TelefonoDetail",
  props: ["telefonoUrl"],
  data() {
    return {
      telefono: null,
      loading: true,
      error: null,
    };
  },
  async created() {
    const url = decodeURIComponent(this.telefonoUrl);
    await this.fetchTelefono(url);
  },
  methods: {
    async fetchTelefono(url) {
      try {
        const response = await api.get(url);
        this.telefono = response.data;
      } catch (err) {
        this.error = "No se pudo cargar el teléfono.";
      } finally {
        this.loading = false;
      }
    },
    async guardar() {
      await api.put(this.telefono.url, this.telefono);
      this.$router.push("/telefonos");
    },
  },
};
</script>

<style scoped>
.telefono-detail-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 8px;
}
label {
  display: block;
  margin-top: 10px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
}
button {
  padding: 8px 16px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 4px;
}
.back-button {
  display: inline-block;
  margin-top: 20px;
  color: #007bff;
  text-decoration: none;
}
.back-button:hover {
  text-decoration: underline;
}
.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
