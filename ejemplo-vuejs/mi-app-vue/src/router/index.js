import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue"; // Tu nuevo componente de login
import EstudiantesList from "../views/EstudiantesList.vue"; // Tu nuevo componente de lista de estudiantes
import EstudianteDetail from "../views/EstudianteDetail.vue"; // ¡Importa el nuevo componente!
import TelefonoList from "../views/TelefonoList.vue";
import TelefonoDetail from "../views/TelefonoDetail.vue";
import TelefonoAg from "@/views/TelefonoAg.vue";
import EstudianteEditar from "../views/EstudianteEditar.vue";
import EstudianteCrear from "../views/EstudianteCrear.vue";

const routes = [
  {
    path: "/telefonos/nuevo",
    name: "TelefonoAgregar",
    component: TelefonoAg,
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/estudiantes",
    name: "EstudiantesList",
    component: EstudiantesList,
    meta: { requiresAuth: true }, // Marca esta ruta como protegida
  },
  {
    path: "/estudiantes/detail/:estudianteUrl*", // <-- ¡Cambio clave aquí!
    name: "EstudianteDetail",
    component: EstudianteDetail,
    props: true, // Esto pasa el ':id' como una prop al componente EstudianteDetail
    meta: { requiresAuth: true },
  },
  { path: "/telefonos", name: "TelefonosList", component: TelefonoList },
  {
    path: "/telefonos/:telefonoUrl",
    name: "TelefonoDetail",
    component: TelefonoDetail,
    props: true,
  },
  {
    path: "/estudiantes/editar/:estudianteUrl",
    name: "EstudianteEditar",
    component: EstudianteEditar,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/estudiantes/nuevo",
    name: "EstudianteCrear",
    component: EstudianteCrear,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Guarda de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("authToken")) {
    next("/login"); // Redirige al login si no está autenticado
  } else {
    next();
  }
});

export default router;
