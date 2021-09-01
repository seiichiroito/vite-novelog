<template>
  <header class="h-12 sticky top-0 shadow z-10 bg-white">
    <div
      class="h-full px-4 max-w-3xl mx-auto flex items-center justify-between"
    >
      <button class="p-3">
        <UserIcon class="w-6" />
      </button>
      <img :src="logo" alt="logo" class="w-8" />
      <button class="p-3">
        <InformationCircleIcon class="w-6" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { UserIcon, InformationCircleIcon } from "@heroicons/vue/outline";
import logo from "../../assets/logo.png";
</script>

<style></style>
