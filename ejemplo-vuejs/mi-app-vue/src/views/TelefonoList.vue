<template>
  <div class="telefonos-list-container">
    <h2>Listado de Teléfonos</h2>
    <p v-if="loading">Cargando...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <table v-else class="table">
      <thead>
        <tr>
          <th>Teléfono</th>
          <th>Tipo</th>
          <th>Estudiante (ID o URL)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="telefono in telefonos" :key="telefono.url">
          <td>{{ telefono.telefono }}</td>
          <td>{{ telefono.tipo }}</td>
          <td>{{ telefono.estudiante_nombre }}</td>
          <td>
            <router-link
              :to="{
                name: 'TelefonoDetail',
                params: { telefonoUrl: encodeURIComponent(telefono.url) },
              }"
              >📝
            </router-link>
            <button @click="eliminarTelefono(telefono.url)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
    <router-link :to="{ name: 'TelefonoAgregar' }" class="add-button">
      Agregar Nuevo Teléfono
    </router-link>
    <router-link to="/" class="back-button">Volver al inicio</router-link>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "TelefonoList",
  data() {
    return {
      telefonos: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchTelefonos();
  },
  methods: {
    async fetchTelefonos() {
      try {
        const response = await api.get("/numerosts/");
        const telefonosData = response.data.results || response.data;

        // Mapea cada teléfono para agregarle el nombre del estudiante
        const telefonosConNombre = await Promise.all(
          telefonosData.map(async (t) => {
            try {
              const estudianteRes = await api.get(t.estudiante);
              t.estudiante_nombre = `${estudianteRes.data.nombre} ${estudianteRes.data.apellido}`;
            } catch {
              t.estudiante_nombre = "No disponible";
            }
            return t;
          })
        );

        this.telefonos = telefonosConNombre;
      } catch (err) {
        this.error = "Error al cargar teléfonos.";
      } finally {
        this.loading = false;
      }
    },
    async eliminarTelefono(url) {
      if (confirm("¿Deseas eliminar este número?")) {
        await api.delete(url);
        await this.fetchTelefonos();
      }
    },
  },
};
</script>

<style scoped>
.telefonos-list-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fefefe;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: left;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.add-button {
  display: block;
  width: fit-content;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #218838;
}

.back-button {
  margin-top: 20px;
  display: block;
  width: fit-content;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}

.back-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
