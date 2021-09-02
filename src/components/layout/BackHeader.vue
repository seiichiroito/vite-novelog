<template>
  <header class="h-12 sticky top-0 shadow z-10 bg-white">
    <div
      class="h-full px-4 max-w-3xl mx-auto flex items-center justify-between"
    >
      <button class="p-3" @click="backHandler">
        <ArrowLeftIcon class="w-4" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { ArrowLeftIcon } from "@heroicons/vue/outline";

const emit = defineEmits(["onClick"]);

const backHandler = () => {
  emit("onClick");
};
</script>

<style></style>
