import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

import { getUser } from "../composables/auth";
const { isLoggedIn } = getUser();

const requiredAuth = (to, from, next) => {
  if (isLoggedIn.value) {
    return next();
  } else {
    return next({ name: "Login" });
  }
};
const unRequiredAuth = (to, from, next) => {
  if (isLoggedIn.value) {
    return next({ name: "Home" });
  } else {
    return next();
  }
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue"),
  },
  {
    path: "/message",
    name: "Message",
    component: () => import("../views/Message.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("../views/Setting.vue"),
    beforeEnter: requiredAuth,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/auth/Login.vue"),
    beforeEnter: unRequiredAuth,
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../views/auth/Signup.vue"),
    beforeEnter: unRequiredAuth,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
