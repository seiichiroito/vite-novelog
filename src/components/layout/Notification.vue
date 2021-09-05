<template>
  <div
    v-if="notification"
    class="
      text-center
      absolute
      z-10
      left-0
      right-0
      flex
      items-center
      justify-center
    "
    :class="bgColor"
  >
    {{ notification.message }}
    <button class="p-2" @click="clearNotification">
      <XCircleIcon class="w-6" />
    </button>
  </div>
</template>

<script setup>
import { XCircleIcon } from "@heroicons/vue/outline";
import { computed, inject } from "@vue/runtime-core";

const notification = inject("notification");
const clearNotification = inject("clearNotification");

const bgColor = computed(() => {
  const { type } = notification.value;
  if (type === "pending") {
    return { "bg-gray-300": true };
  }
  if (type === "warning") {
    return { "bg-yellow-300": true };
  }
  if (type === "error") {
    return { "bg-red-300": true };
  }
  if (type === "success") {
    return { "bg-green-300": true };
  }
});
</script>

<style></style>
