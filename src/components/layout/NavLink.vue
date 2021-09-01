<template>
  <router-link :to="to" class="flex-1 flex justify-center items-center">
    <slot></slot>
  </router-link>
</template>

<script>
export default {
  props: {
    to: Object,
  },
  setup() {},
};
</script>

<style></style>
