<template>
  <header class="h-12 sticky top-0 shadow z-10 bg-blue-200">
    <div
      class="h-full px-4 max-w-3xl mx-auto flex items-center justify-between"
    >
      <button class="p-3" @click="backHandler">
        <ArrowLeftIcon class="w-4" />
      </button>
      <p>{{ room?.title || messenger.displayName }}</p>
      <button class="p-3" @click="profileHandeler">
        <img
          v-if="messenger.photoURL"
          :src="messenger.photoURL"
          :alt="messenger.displayName"
          class="w-8 h-8 rounded-full border-white border-2"
        />
        <img
          v-else
          :src="defaultProfile"
          alt="default"
          class="w-8 h-8 rounded-full border-white border-2"
        />
      </button>
    </div>
  </header>
  <main class="bg-blue-200">
    <div
      class="overflow-scroll max-w-3xl mx-auto h-main px-2 py-8"
      ref="mainChat"
    >
      <MainChat :messages="room?.messages" />
    </div>
  </main>
  <footer class="h-16">
    <div class="h-full max-w-3xl mx-auto grid items-center">
      <div v-if="novelPage" class="flex gap-2 px-4 justify-between">
        <button
          v-if="room?.favorited.includes(currentUser?.uid)"
          class="py-2 flex gap-1 items-center"
          @click="unFavoriteHandler"
        >
          <HeartIconSolid class="w-6 text-red-400" />
          <p>{{ room?.favorited.length }}</p>
        </button>
        <button
          v-else
          class="py-2 flex gap-1 items-center"
          @click="favoriteHandler"
        >
          <HeartIcon class="w-6" />
          <p>{{ room?.favorited.length }}</p>
        </button>
        <div class="flex gap-4">
          <button
            class="p-2 flex gap-1 items-center"
            @click="clickForwardHandler"
          >
            <i class="pi pi-fast-forward text-xl"></i>
          </button>
          <button
            v-if="isPausing"
            class="p-2 flex gap-1 items-center"
            @click="clickPlayHandler"
          >
            <i class="pi pi-play text-xl"></i>
          </button>
          <button
            v-else
            class="p-2 flex gap-1 items-center"
            @click="clickPauseHandler"
          >
            <i class="pi pi-pause text-xl"></i>
          </button>
        </div>
      </div>
      <form v-else class="flex gap-2 px-4" @submit.prevent="submitInputHandler">
        <textarea
          class="flex-1 border p-1 rounded-full resize-none"
          rows="1"
          v-model.trim="inputText"
        />
        <button class="p-2">
          <i class="pi pi-send text-xl"></i>
        </button>
      </form>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ArrowLeftIcon } from "@heroicons/vue/outline";
import { ref } from "@vue/reactivity";
import defaultProfile from "../../assets/default-profile.jpeg";
import { onUpdated, watch, watchEffect } from "@vue/runtime-core";
import MainChat from "./MainChat.vue";

const props = defineProps({
  room: {
    type: Object,
  },
  isPausing: Boolean,
  novelPage: Boolean,
  messenger: {
    type: Object,
    default: () => ({ photoUrl: "", displayName: "" }),
  },
});

const mainChat = ref(null);

onUpdated(() => {
  mainChat.value.scrollTop = mainChat.value.scrollHeight;
});

const emit = defineEmits(["onSubmit", "onPlay", "onPause", "onForward"]);

const inputText = ref("");

const router = useRouter();

const backHandler = () => {
  router.go(-1);
};

const profileHandeler = () => {
  router.push({
    name: "Profile",
    params: { userId: props.messenger.id },
  });
};

const submitInputHandler = () => {
  if (inputText.value === "") {
    return;
  }

  emit("onSubmit", inputText.value);
  inputText.value = "";
};

// For Novel Room

import { HeartIcon } from "@heroicons/vue/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/vue/solid";
import { getUser } from "../../composables/auth";
import { functions } from "../../firebase/config";
import { httpsCallable } from "firebase/functions";
const { currentUser } = getUser();

const unFavoriteHandler = async () => {
  const unFavoriteNovel = httpsCallable(functions, "unFavoriteNovel");
  try {
    const res = await unFavoriteNovel({ novelId: props.room.id });
    // console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const favoriteHandler = async () => {
  const favoriteNovel = httpsCallable(functions, "favoriteNovel");
  try {
    const res = await favoriteNovel({ novelId: props.room.id });
    // console.log(res);
  } catch (err) {
    console.log(err);
  }
};

// Play, Forward and Pause
const clickPauseHandler = () => {
  emit("onPause");
};

const clickPlayHandler = () => {
  emit("onPlay");
};

const clickForwardHandler = () => {
  emit("onForward");
};
</script>

<style></style>
