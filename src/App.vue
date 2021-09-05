<template>
  <!-- <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive> -->
  <!-- </router-view> -->
  <router-view></router-view>
</template>

<script setup>
import { provide, readonly, ref } from "@vue/runtime-core";
const notification = ref(null);

const setNotification = (value) => {
  notification.value = value;
};
provide("notification", notification, readonly(notification));

provide("setNotification", setNotification);
</script>

<style></style>
