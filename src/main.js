import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import "vue-loading-overlay/dist/vue-loading.css";
import "primeicons/primeicons.css";
import "./assets/index.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import "./library/util/screenHeight";

let app;

onAuthStateChanged(auth, () => {
  if (app) {
    return;
  }

  app = createApp(App).use(store).use(router).mount("#app");
});
