<template>
  <header class="h-12 sticky top-0 shadow z-10 bg-white">
    <div
      class="h-full px-4 max-w-3xl mx-auto flex items-center justify-between"
    >
      <button class="p-3" @click="profileHandler" v-if="currentUser">
        <UserIcon class="w-6" />
      </button>
      <img :src="logo" alt="logo" class="w-8" />
      <button class="p-3" @click="infoRoomHandler">
        <InformationCircleIcon class="w-6" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { UserIcon, InformationCircleIcon } from "@heroicons/vue/outline";
import { useRouter } from "vue-router";
import logo from "../../assets/logo.png";

import { getUser } from "../../composables/auth";
const router = useRouter();
const { currentUser } = getUser();

const profileHandler = () => {
  router.push({ name: "Profile", params: { userId: currentUser.value.uid } });
};

const infoRoomHandler = () => {
  router.push({
    name: "NovelRoom",
    params: { novelId: "RbMqInO7OqdSqrjPdCPw" },
  });
};
</script>

<style></style>
