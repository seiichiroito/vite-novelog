<template>
  <ul v-if="!novels || novels.length === 0" class="grid">
    <li className="h-20"></li>
    <li className="h-20 border-t"></li>
    <li className="h-20 border-t"></li>
    <li className="h-20 border-t"></li>
    <li className="h-20 border-t"></li>
    <li className="h-20 border-t"></li>
    <li className="h-20 border-t"></li>
  </ul>
  <ul v-else>
    <NovelCard v-for="novel in novels" :key="novel.id" :novel="novel" />
    <li class="h-20 border-t"></li>
  </ul>
</template>

<script setup>
import NovelCard from "./NovelCard.vue";

const props = defineProps({
  novels: Array,
});
</script>

<style></style>
