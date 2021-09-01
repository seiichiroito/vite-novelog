<template>
  <Layout>
    <div className="h-full flex flex-col items-center justify-center">
      <button
        className="border-green-400 border rounded-3xl px-16 py-2 hover:bg-green-400 hover:text-white"
        @click="logoutHandler"
      >
        Logout
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { useRouter } from "vue-router";

import Layout from "../components/layout/Layout.vue";
import { uselogout } from "../composables/auth";

const { error, isPending, logout } = uselogout();
const router = useRouter();

const logoutHandler = async () => {
  try {
    await logout();

    router.push({ name: "Login" });
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
