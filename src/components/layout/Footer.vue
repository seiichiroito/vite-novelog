<template>
  <footer class="h-16 border-t">
    <div class="h-full max-w-3xl mx-auto flex">
      <NavLink :to="{ name: 'Home' }"><HomeIcon class="w-8" /></NavLink>
      <NavLink :to="{ name: 'Search' }"> <SearchIcon class="w-8" /> </NavLink>
      <NavLink :to="{ name: 'Message' }"><ChatIcon class="w-8" /></NavLink>
      <NavLink :to="{ name: 'Setting' }"><CogIcon class="w-8" /></NavLink>
    </div>
  </footer>
</template>

<script setup>
import NavLink from "./NavLink.vue";
import {
  HomeIcon,
  SearchIcon,
  CogIcon,
  ChatIcon,
} from "@heroicons/vue/outline";
</script>

<style></style>
