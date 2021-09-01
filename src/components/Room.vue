<template>
  <header class="h-12 sticky top-0 shadow z-10 bg-blue-200">
    <div
      class="h-full px-4 max-w-3xl mx-auto flex items-center justify-between"
    >
      <button class="p-3" @click="backHandler">
        <ArrowLeftIcon class="w-4" />
      </button>
      <p>{{ title }}</p>
      <button class="p-3" @click="profileHandeler">
        <img
          v-if="user?.photoUrl"
          :src="user?.photoUrl"
          :alt="user?.username"
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
  <main className="bg-blue-200">
    <div className="overflow-scroll  max-w-3xl mx-auto h-main">
      <MainChat :messages="messages" />
    </div>
  </main>
  <footer className="h-16">
    <div className="h-full max-w-3xl mx-auto grid items-center">
      <form className="flex gap-2 px-4" @submit.prevent="submitInputHandler">
        <textarea
          className="flex-1 border p-1 rounded-full resize-none"
          rows="1"
          v-model="inputText"
        />
        <button className="p-2">
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
import defaultProfile from "../assets/default-profile.jpeg";
import MainChat from "./MainChat.vue";

const props = defineProps({
  title: String,
  user: Object,
  messages: Array,
});

const emit = defineEmits(["onSubmit"]);

const inputText = ref("");

const router = useRouter();

const backHandler = () => {
  router.go(-1);
};

const profileHandeler = () => {
  router.push({ name: "Profile", prams: { userId: props.user.id } });
};

const submitInputHandler = () => {
  emit("onSubmit", inputText.value);
  inputText.value = "";
};
</script>

<style></style>
