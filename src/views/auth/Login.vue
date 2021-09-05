<template>
  <Layout>
    <AuthForm email password buttonText="Login" @onSubmit="submitHandler" />
  </Layout>
</template>

<script setup>
import Layout from "../../components/layout/Layout.vue";
import AuthForm from "../../components/auth/AuthForm.vue";
import { useLogin } from "../../composables/auth";
import { useRouter } from "vue-router";
import { inject } from "@vue/runtime-core";

const { error, isPending, login } = useLogin();
const router = useRouter();
const setNotification = inject("setNotification");

setNotification("HELLO");

const submitHandler = async (formData) => {
  try {
    const user = await login(formData.value);

    if (!user || error.value) {
      return;
    }

    router.push({ name: "Home" });
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
