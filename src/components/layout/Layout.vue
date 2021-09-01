<template>
  <Header />
  <main class="h-main overflow-scroll max-w-3xl mx-auto">
    <slot></slot>
  </main>
  <Footer />
</template>

<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
</script>
