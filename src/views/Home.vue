<template>
  <Layout>
    <NovelList :novels="formattedNovels" />
    <router-link
      :to="{ name: 'NewNovel' }"
      class="
        fixed
        bottom-20
        right-8
        rounded-full
        p-3
        shadow-sm
        bg-green-400
        text-white
      "
    >
      <PlusIcon class="w-6" />
    </router-link>
  </Layout>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import Layout from "../components/layout/Layout.vue";
import NovelList from "../components/novel/NovelList.vue";
import { formatDistanceToNow } from "date-fns";
import { getCollection } from "../composables/firestore";
import { PlusIcon } from "@heroicons/vue/outline";
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
