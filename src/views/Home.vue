<template>
  <Layout>
    <TabNav
      :tabs="tabs"
      :currentTab="currentTab"
      @onChange="changeTabHandler"
    />
    <NovelList :novels="formattedNovels" @loadDocument="loadDocumentHandler" />
    <router-link
      v-if="currentUser"
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
import { computed, ref } from "@vue/reactivity";
import Layout from "../components/layout/Layout.vue";
import NovelList from "../components/novel/NovelList.vue";
import { formatDistanceToNow } from "date-fns";
import {
  getCollection,
  getDocument,
  getDocumentRef,
  getNextCollection,
} from "../composables/firestore";
import { PlusIcon } from "@heroicons/vue/outline";
import TabNav from "../components/layout/TabNav.vue";
import { getUser } from "../composables/auth";
import { watch, watchEffect } from "@vue/runtime-core";

const { currentUser } = getUser();

const { document: currentUserDoc } = getDocument(
  "users",
  currentUser.value?.uid || "NONUSER"
);

const feedNovels = ref(null);

const { documents: recentNovels } = getCollection("novels");

const { documents: popularNovels } = getCollection(
  "novels",
  null,
  null,
  "favorited_count"
);

const filteredNovels = computed(() => {
  switch (currentTab.value) {
    case "recently":
      return recentNovels.value;
    case "feed":
      if (!feedNovels.value) {
        return [];
      }

      return feedNovels.value.value;
    case "popular":
      return popularNovels.value;
      break;
  }
});

const tabs = ref([]);

if (currentUser.value) {
  tabs.value = ["recently", "feed", "popular"];
} else {
  tabs.value = ["recently", "popular"];
}

const currentTab = ref(tabs.value[0]);

watch(currentUserDoc, () => {
  if (!currentUserDoc.value) {
    return;
  }
  if (currentUserDoc.value.following.length === 0) {
    return;
  }
  const { documents: novels } = getCollection("novels", [
    "owner",
    "in",
    currentUserDoc.value.following,
  ]);
  feedNovels.value = novels;
});

const changeTabHandler = (tabName) => {
  currentTab.value = tabName;
};
const formattedNovels = computed(() => {
  return filteredNovels.value.map((novel) => {
    return {
      ...novel,
      createdAt: formatDistanceToNow(novel.createdAt.toDate()),
    };
  });
});

// Load Document
const loadDocumentHandler = (lastNovel) => {
  // console.log("I don't know");
  // const { documents: nextNovels } = getNextCollection("novels", lastNovel, 5);
  // console.log(nextNovels);
};
</script>

<style></style>
