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
let timer;

const setNotification = ({ type, message }) => {
  clearTimeout(timer);

  notification.value = {
    type,
    message,
  };

  timer = setTimeout(() => {
    notification.value = null;
  }, 5000);
};

const clearNotification = () => {
  notification.value = null;
  clearTimeout(timer);
};

provide("notification", notification, readonly(notification));

provide("setNotification", setNotification);

provide("clearNotification", clearNotification);
</script>

<style></style>
