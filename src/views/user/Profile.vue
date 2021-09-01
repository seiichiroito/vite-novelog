<template>
  <div>
    <header class="h-12 sticky top-0 shadow z-10 bg-white">
      <div
        class="h-full px-4 max-w-3xl mx-auto flex items-center justify-between"
      >
        <button class="p-3" @click="backHanler">
          <ArrowLeftIcon class="w-4" />
        </button>
      </div>
    </header>
    <div class="relative h-28 p-8">
      <div class="absolute inset-0 bg-gray-300"></div>
      <div class="relative flex gap-4">
        <img
          v-if="user"
          :src="user.photoUrl"
          :alt="user.displayName"
          class="w-12 h-12 rounded-full"
        />
        <div
          v-else
          class="w-12 h-12 rounded-full object-cover bg-gray-300"
        ></div>

        <div>
          <p>{{ user?.displayName }}</p>
          <p class="text-gray-400 text-sm">@{{ user?.username }}</p>
        </div>
      </div>
    </div>
    <div class="p-4 grid gap-4">
      <p>{{ user?.bio }}</p>
      <div class="flex justify-between items-center">
        <div class="flex gap-4">
          <p>{{ user?.following.length }} following</p>
          <p>0 follower</p>
        </div>
        <button
          v-if="currentUser.uid === user?.id"
          class="rounded-full border-green-400 border px-4 py-1"
        >
          Edit Profile
        </button>
        <div v-else class="flex gap-4">
          <button class="border border-black rounded-full p-2">
            <ChatIcon class="w-4" />
          </button>
          <button
            v-if="user?.following.includes(currentUser.uid)"
            class="rounded-full bg-green-400 text-white border px-4 py-1"
          >
            Following
          </button>
          <button v-else class="rounded-full border-green-400 border px-4 py-1">
            Follow
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChatIcon, ArrowLeftIcon } from "@heroicons/vue/outline";
const props = defineProps({
  userId: String,
});
import { getDocument } from "../../composables/firestore";
import { getUser } from "../../composables/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const { currentUser } = getUser();
const { document: user, error } = getDocument("users", props.userId);

const backHanler = () => {
  router.go(-1);
};
</script>

<style></style>
