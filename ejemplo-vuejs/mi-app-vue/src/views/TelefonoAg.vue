<template>
  <div class="telefono-form-container">
    <h2>{{ isEditing ? "Editar Teléfono" : "Agregar Nuevo Teléfono" }}</h2>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="success" class="success-message">
      {{ success }}
    </div>

    <form @submit.prevent="submitForm" class="telefono-form">
      <div class="form-group">
        <label for="telefono">Número de Teléfono:</label>
        <input
          type="text"
          id="telefono"
          v-model="form.telefono"
          placeholder="Ej: 0987654321"
          required
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="tipo">Tipo:</label>
        <select id="tipo" v-model="form.tipo" required class="form-control">
          <option value="">Seleccione un tipo</option>
          <option value="movil">Móvil</option>
          <option value="casa">Casa</option>
          <option value="trabajo">Trabajo</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div class="form-group">
        <label for="estudiante">Estudiante:</label>
        <select
          id="estudiante"
          v-model="form.estudiante"
          required
          class="form-control"
        >
          <option value="">Seleccione un estudiante</option>
          <option
            v-for="estudiante in estudiantes"
            :key="estudiante.id || estudiante.url"
            :value="estudiante.url || estudiante.id"
          >
            {{ estudiante.nombre }} {{ estudiante.apellido }} -
            {{ estudiante.cedula }}
          </option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar" }}
        </button>

        <router-link to="/telefonos" class="btn btn-secondary">
          Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "TelefonoForm",
  data() {
    return {
      form: {
        telefono: "",
        tipo: "",
        estudiante: "",
      },
      estudiantes: [],
      loading: false,
      error: null,
      success: null,
      isEditing: false,
      telefonoId: null,
    };
  },
  async created() {
    await this.fetchEstudiantes();

    // Si hay un parámetro de ID o URL, se está editando
    if (this.$route.params.id || this.$route.params.telefonoUrl) {
      this.isEditing = true;
      this.telefonoId =
        this.$route.params.id ||
        this.extractIdFromUrl(this.$route.params.telefonoUrl);
      await this.fetchTelefono();
    }
  },
  methods: {
    async fetchEstudiantes() {
      try {
        const response = await api.get("/estudiantes/");
        this.estudiantes = response.data.results || response.data;
      } catch (err) {
        console.error("Error al cargar estudiantes:", err);
        this.error = "Error al cargar la lista de estudiantes";
      }
    },

    async fetchTelefono() {
      try {
        let url = `/numerosts/${this.telefonoId}/`;
        if (this.$route.params.telefonoUrl) {
          url = decodeURIComponent(this.$route.params.telefonoUrl);
        }

        const response = await api.get(url);
        this.form = {
          telefono: response.data.telefono,
          tipo: response.data.tipo,
          estudiante: response.data.estudiante,
        };
      } catch (err) {
        console.error("Error al cargar teléfono:", err);
        this.error = "No se pudo cargar el teléfono";
      }
    },

    async submitForm() {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        if (this.isEditing) {
          // Actualizar teléfono
          let url = `/numerosts/${this.telefonoId}/`;
          if (this.$route.params.telefonoUrl) {
            url = decodeURIComponent(this.$route.params.telefonoUrl);
          }

          await api.put(url, this.form);
          this.success = "Teléfono actualizado exitosamente";
        } else {
          // Crear nuevo teléfono
          await api.post("/numerosts/", this.form);
          this.success = "Teléfono agregado exitosamente";

          this.form = {
            telefono: "",
            tipo: "",
            estudiante: "",
          };
        }

        // Redirige después de 1.5 segundos
        setTimeout(() => {
          this.$router.push("/telefonos");
        }, 1500);
      } catch (err) {
        console.error("Error al guardar teléfono:", err);

        if (err.response && err.response.data) {
          if (typeof err.response.data === "object") {
            const errors = Object.values(err.response.data).flat();
            this.error = errors.join(", ");
          } else {
            this.error = err.response.data;
          }
        } else {
          this.error = "Error al guardar el teléfono";
        }
      } finally {
        this.loading = false;
      }
    },

    extractIdFromUrl(url) {
      const match = url.match(/\/(\d+)\/$/);
      return match ? match[1] : null;
    },
  },
};
</script>

<style scoped>
.telefono-form-container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fefefe;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.telefono-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 20px;
}

.success-message {
  color: #155724;
  background-color: #d4edda;
  padding: 10px;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin-bottom: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
</style>
