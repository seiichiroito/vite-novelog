<template>
  <Layout>
    <AuthForm email password buttonText="Login" @onSubmit="submitHandler" />
  </Layout>
</template>

<script setup>
import Layout from "../../components/layout/Layout.vue";
import AuthForm from "../../components/auth/AuthForm.vue";
import { useLogin } from "../../composables/auth";

const { error, isPending, login } = useLogin();
const submitHandler = async (formData) => {
  try {
    const user = await login(formData.value);
    console.log(user);
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
