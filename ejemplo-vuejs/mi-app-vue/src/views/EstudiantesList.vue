<template>
  <div class="estudiantes-list-container">
    <h2>Listado de Estudiantes</h2>
    <p v-if="loading">Cargando estudiantes...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <ul v-else-if="estudiantes.length">
      <li
        v-for="estudiante in estudiantes"
        :key="estudiante.url"
        class="estudiante-item"
      >
        <div class="estudiante-item-content">
          <router-link
            :to="{
              name: 'EstudianteDetail',
              params: { estudianteUrl: estudiante.url },
            }"
          >
            {{ estudiante.nombre }} {{ estudiante.apellido }} (Cédula:
            {{ estudiante.cedula }})
          </router-link>
          <div class="acciones">
            <router-link
              class="editar-btn"
              :to="{
                name: 'EstudianteEditar',
                params: { estudianteUrl: estudiante.url },
              }"
            >
              ✏️ Editar
            </router-link>
            <button
              class="eliminar-btn"
              @click="eliminarEstudiante(estudiante.url)"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </li>
    </ul>
    <p v-else>No hay estudiantes registrados.</p>
    <router-link to="/estudiantes/nuevo" class="add-button"
      >Agregar Nuevo Estudiante</router-link
    >
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "EstudiantesList",
  data() {
    return {
      estudiantes: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchEstudiantes();
  },
  methods: {
    async fetchEstudiantes() {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get("estudiantes/");
        this.estudiantes = response.data.results || response.data;
        console.log("Estudiantes cargados:", this.estudiantes);
      } catch (err) {
        console.error("Error al cargar estudiantes:", err.response || err);
        this.error =
          "No se pudieron cargar los estudiantes. Asegúrate de estar logueado.";
      } finally {
        this.loading = false;
      }
    },
    async eliminarEstudiante(url) {
      if (confirm("¿Estás seguro de eliminar este estudiante?")) {
        await api.delete(url);
        await this.fetchEstudiantes();
      }
    },
  },
};
</script>

<style scoped>
/* Paleta de colores moderna */
:root {
  --primary-color: #667eea;
  --primary-dark: #5a6fd8;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --success-color: #4ecdc4;
  --warning-color: #feca57;
  --error-color: #ff6b6b;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --background: #f8f9fa;
  --card-bg: #ffffff;
  --border-color: #e9ecef;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.estudiantes-list-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  border: 2px solid var(--primary-color);
  border-radius: 16px;
  box-shadow: var(--shadow-hover);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

h2 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 25px;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.1);
}

ul {
  list-style: none;
  padding: 0;
}

.estudiante-item {
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 8px;
  background: var(--card-bg);
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}

.estudiante-item:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-color);
}

.estudiante-item:last-child {
  border-bottom: none;
}

.estudiante-item a {
  text-decoration: none;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.estudiante-item a:hover {
  color: var(--primary-dark);
  text-decoration: none;
}

.add-button {
  display: block;
  width: fit-content;
  margin: 25px auto 0;
  padding: 15px 30px;
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  border-radius: 12px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}

.add-button:hover {
  background: linear-gradient(
    135deg,
    var(--secondary-color),
    var(--primary-color)
  );
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  color: rgba(62, 8, 45, 0.89);
  text-decoration: none;
}

.error-message {
  background: linear-gradient(135deg, var(--error-color), #ff8e8e);
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  text-align: center;
  margin: 15px 0;
  font-weight: 500;
  box-shadow: var(--shadow);
}

.estudiante-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.acciones {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.editar-btn,
.eliminar-btn {
  padding: 8px 16px;
  font-size: 0.9rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.editar-btn {
  background: linear-gradient(135deg, var(--success-color), #48c6b7);
  color: white;
}

.editar-btn:hover {
  background: linear-gradient(135deg, #48c6b7, var(--success-color));
  transform: translateY(-1px);
  color: white;
  text-decoration: none;
}

.eliminar-btn {
  background: linear-gradient(135deg, var(--error-color), #ff5252);
  color: white;
}

.eliminar-btn:hover {
  background: linear-gradient(135deg, #ff5252, var(--error-color));
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .estudiantes-list-container {
    margin: 20px;
    padding: 20px;
  }

  h2 {
    font-size: 1.6rem;
  }

  .estudiante-item-content {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .acciones {
    width: 100%;
    justify-content: center;
  }

  .editar-btn,
  .eliminar-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
