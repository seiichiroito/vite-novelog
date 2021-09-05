<template>
  <Layout>
    <AuthForm
      displayName
      email
      password
      buttonText="Signup"
      @onSubmit="submitHandler"
    />
  </Layout>
  <Loading :active="isPending" :is-full-page="true" />
</template>

<script setup>
import { useRouter } from "vue-router";

import Layout from "../../components/layout/Layout.vue";
import AuthForm from "../../components/auth/AuthForm.vue";
import { useSignup } from "../../composables/auth";
import Loading from "vue-loading-overlay";
import { inject } from "@vue/runtime-core";

const router = useRouter();
const { signupWithEmailAndPassword, error, isPending } = useSignup();
const setNotification = inject("setNotification");

const submitHandler = async (formData) => {
  try {
    const user = await signupWithEmailAndPassword(formData.value);

    if (!user || error.value) {
      setNotification({ type: "error", message: error.value });
      return;
    }

    setNotification({
      type: "success",
      message: "Confirmation link sent to your email",
    });

    router.push({ name: "EmailConfirmation" });
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
