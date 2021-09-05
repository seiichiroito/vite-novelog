<template>
  <Layout>
    <AuthForm email password buttonText="Login" @onSubmit="submitHandler" />
    <Loading :active="isPending" :is-full-page="true" />
  </Layout>
</template>

<script setup>
import Layout from "../../components/layout/Layout.vue";
import AuthForm from "../../components/auth/AuthForm.vue";
import { useLogin } from "../../composables/auth";
import { useRouter } from "vue-router";
import { inject } from "@vue/runtime-core";
import Loading from "vue-loading-overlay";

const { error, isPending, login } = useLogin();
const router = useRouter();
const setNotification = inject("setNotification");

const submitHandler = async (formData) => {
  try {
    const user = await login(formData.value);

    if (!user || error.value) {
      setNotification({ type: "error", message: error.value });
      return;
    }
    setNotification({ type: "success", message: "Success to login" });

    router.push({ name: "Home" });
  } catch (err) {
    console.log(error.value);
  }
};
</script>

<style></style>
