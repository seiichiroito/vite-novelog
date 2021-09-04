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
  </ul>
  <div class="h-20 border-t" ref="bottomRef"></div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import NovelCard from "./NovelCard.vue";

const props = defineProps({
  novels: Array,
});

const emit = defineEmits(["loadDocument"]);

const bottomRef = ref(null);
const observer = ref(null);

onMounted(() => {
  const handler = (entries) => {
    console.log(entries);
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  const callback = (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && props.novels.length) {
      emit("loadDocument", props.novels[props.novels.length - 1]);
    }
  };

  observer.value = new IntersectionObserver(callback, options);

  observer.value.observe(bottomRef.value);
});
</script>

<style></style>
