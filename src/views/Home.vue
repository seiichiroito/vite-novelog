<template>
  <Layout>
    <TabNav
      :tabs="tabs"
      :currentTab="currentTab"
      @onChange="changeTabHandler"
    />
    <NovelList :novels="formattedNovels" />
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
import { getCollection } from "../composables/firestore";
import { PlusIcon } from "@heroicons/vue/outline";
import TabNav from "../components/layout/TabNav.vue";
import { getUser } from "../composables/auth";

const { currentUser } = getUser();

const { error, documents: novels } = getCollection("novels");

const tabs = ref([]);

if (currentUser.value) {
  tabs.value = ["recently", "feed", "popular"];
} else {
  tabs.value = ["recently", "popular"];
}
const currentTab = ref(tabs.value[0]);

const changeTabHandler = (tabName) => {
  currentTab.value = tabName;
};
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
