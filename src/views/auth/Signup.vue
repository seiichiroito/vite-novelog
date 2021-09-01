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
</template>

<script setup>
import { useRouter } from "vue-router";

import Layout from "../../components/layout/Layout.vue";
import AuthForm from "../../components/auth/AuthForm.vue";
import { useSignup } from "../../composables/auth";

const router = useRouter();
const { signupWithEmailAndPassword, error, isPending } = useSignup();

const submitHandler = async (formData) => {
  try {
    const user = await signupWithEmailAndPassword(formData.value);

    if (!user || error.value) {
      return;
    }

    router.push({ name: "EmailConfirmation" });
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
