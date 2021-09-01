<template>
  <Layout>
    <NovelList :novels="formattedNovels" />
  </Layout>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import Layout from "../components/layout/Layout.vue";
import NovelList from "../components/novel/NovelList.vue";
import { formatDistanceToNow } from "date-fns";
import { getCollection } from "../composables/firestore";

const { error, documents: novels } = getCollection("novels");

const formattedNovels = computed(() => {
  return novels.value.map((novel) => {
    return {
      ...novel,
      createdAt: formatDistanceToNow(novel.createdAt.toDate()),
    };
  });
});
</script>

<style></style>
