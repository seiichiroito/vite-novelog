<template>
  <li class="flex border gap-4 px-4 items-center">
    <button @click="profileHandler">
      <img
        :src="novel.owner.photoURL || defaultProfile"
        alt="novel"
        class="w-12 h-12 rounded-full object-cover"
      />
    </button>
    <div class="flex-1 grid">
      <button
        class="flex justify-between items-center gap-2"
        @click="novelRoomHandler"
      >
        <div class="flex items-center overflow-hidden">
          <p class="font-bold p-2 flex-shrink-0">
            {{ novel.owner.displayName }}
          </p>
          <p class="text-gray-400 text-sm">@{{ novel.owner.username }}</p>
        </div>
        <p class="text-gray-400 text-sm flex-shrink-0">{{ novel.createdAt }}</p>
      </button>
      <button class="py-2 text-left" @click="novelRoomHandler">
        {{ novel.title }}
      </button>
      <div class="flex items-center gap-4">
        <button
          class="flex flex-1 py-2 flex-wrap gap-2 max-h-20 overflow-scroll"
          @click="novelRoomHandler"
        >
          <span
            v-for="genre in novel.genre"
            :key="genre"
            className="border border-gray-600 text-gray-600 text-sm rounded-full px-2"
          >
            {{ genre }}
          </span>
        </button>
        <div class="flex gap-4">
          <button
            v-if="novel.favorited.includes(currentUser?.uid)"
            class="py-3 flex gap-1 items-center text-gray-500"
            @click="unFavoriteHandler"
          >
            <HertIconSolid class="w-4 text-red-400" />
            <p class="text-sm">{{ novel.favorited.length }}</p>
          </button>
          <button
            v-else
            class="py-3 flex gap-1 items-center text-gray-500"
            @click="favoriteHandler"
          >
            <HeartIcon class="w-4" />
            <p class="text-sm">{{ novel.favorited.length }}</p>
          </button>

          <!-- <button class="py-3 flex gap-1 items-center text-gray-500">
            <ChatAltIcon class="w-3" />
            <p class="text-sm">{{ novel.comments.length }}</p>
          </button> -->
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { HeartIcon, ChatAltIcon } from "@heroicons/vue/outline";
import { HeartIcon as HertIconSolid } from "@heroicons/vue/solid";
import { useRouter } from "vue-router";

import { getDocument } from "../../composables/firestore";
import { getUser } from "../../composables/auth";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/config";
import defaultProfile from "../../assets/default-profile.jpeg";

const { currentUser } = getUser();

const props = defineProps({
  novel: Object,
});

const router = useRouter();

const profileHandler = () => {
  router.push({ name: "Profile", params: { userId: props.novel.owner.id } });
};

const novelRoomHandler = () => {
  router.push({ name: "NovelRoom", params: { novelId: props.novel.id } });
};
const unFavoriteHandler = async () => {
  const unFavoriteNovel = httpsCallable(functions, "unFavoriteNovel");
  try {
    const res = await unFavoriteNovel({ novelId: props.novel.id });
    // console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const favoriteHandler = async () => {
  const favoriteNovel = httpsCallable(functions, "favoriteNovel");
  try {
    const res = await favoriteNovel({ novelId: props.novel.id });
    // console.log(res);
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
