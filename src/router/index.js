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
    path: "/messages/:roomId",
    name: "MessageRoom",
    component: () => import("../views/message/MessageRoom.vue"),
    props: true,
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
  {
    path: "/confirmation",
    name: "EmailConfirmation",
    component: () => import("../views/auth/EmailConfirmation.vue"),
  },
  {
    path: "/users/:userId",
    name: "Profile",
    component: () => import("../views/user/Profile.vue"),
    props: true,
  },
  {
    path: "/users/edit",
    name: "EditProfile",
    component: () => import("../views/user/EditProfile.vue"),
  },
  {
    path: "/novels/new",
    name: "NewNovel",
    component: () => import("../views/novel/NewNovel.vue"),
  },
  {
    path: "/novels/:novelId",
    name: "NovelRoom",
    component: () => import("../views/novel/NovelRoom.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
