<template>
  <main class="bg-blue-200">
    <div
      class="overflow-scroll max-w-3xl mx-auto h-newMain px-2 py-4"
      ref="mainChat"
    >
      <MainChat :messages="messages" />
    </div>
  </main>
  <footer class="h-16">
    <div class="h-full max-w-3xl mx-auto grid items-center">
      <form class="flex gap-2 px-4" @submit.prevent="submitInputHandler">
        <select
          v-model="selectedCharacter"
          class="
            appearance-none
            bg-gray-200
            border border-gray-200
            text-gray-700
            px-2
            rounded
            text-sm
            focus:outline-none focus:bg-white focus:border-gray-500
          "
        >
          <option selected disabled value="">select</option>
          <option
            v-for="character in novel.characters"
            :key="character.id"
            :value="character.id"
          >
            {{ character.displayName }}
          </option>
        </select>
        <button class="p-2" @click="clickImageHandler">
          <i class="pi pi-image text-xl"></i>
          <InputImage ref="imageFileRef" @onChange="changeImageHandler" />
        </button>
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
import Room from "../message/Room.vue";
import MainChat from "../message/MainChat.vue";
import { computed, ref } from "@vue/reactivity";
import { Timestamp } from "@firebase/firestore";
import { onUpdated } from "@vue/runtime-core";

const props = defineProps({
  novel: Object,
});

const emit = defineEmits(["onInputSubmit"]);

const inputText = ref("");
const selectedCharacter = ref("");

const mainChat = ref(null);
onUpdated(() => {
  setTimeout(() => {
    mainChat.value.scrollTop = mainChat.value.scrollHeight;
  }, 100);
});

const messages = computed(() => {
  return props.novel.messages.map((message) => {
    const sender = props.novel.characters.find(
      (character) => character.id === message.charId
    );

    return {
      ...message,
      sender,
    };
  });
});

const submitInputHandler = () => {
  if (inputText.value === "") {
    return;
  }

  if (!selectedCharacter.value) {
    return;
  }

  emit("onInputSubmit", {
    body: inputText.value,
    charId: selectedCharacter.value,
    createdAt: Timestamp.fromDate(new Date()),
  });

  inputText.value = "";
};

// Image Handle
import InputImage from "../UI/InputImage.vue";

const imageFileRef = ref(null);

const clickImageHandler = () => {
  imageFileRef.value.click();
};

const changeImageHandler = (file) => {
  if (!file) {
    return;
  }

  if (!selectedCharacter.value) {
    return;
  }

  emit("onInputSubmit", {
    file: file,
    photoURL: URL.createObjectURL(file),
    charId: selectedCharacter.value,
    createdAt: Timestamp.fromDate(new Date()),
  });
};
</script>

<style></style>
