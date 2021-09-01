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
import Layout from "../../components/layout/Layout.vue";
import AuthForm from "../../components/auth/AuthForm.vue";

const submitHandler = (formData) => {
  console.log(formData.value);
};
</script>

<style></style>
