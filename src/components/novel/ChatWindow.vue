<template>
  <main class="bg-blue-200">
    <div class="overflow-scroll max-w-3xl mx-auto h-newMain" ref="mainChat">
      <MainChat :messages="novel.messages" />
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
          <option selected disabled value="">select character</option>
          <option
            v-for="character in props.novel.characters"
            :key="character.id"
            :value="character.id"
          >
            {{ character.displayName }}
          </option>
        </select>
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
import { ref } from "@vue/reactivity";
import { Timestamp } from "@firebase/firestore";

const props = defineProps({
  novel: Object,
});

const emit = defineEmits(["onInputSubmit"]);

const inputText = ref("");
const selectedCharacter = ref("");

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
</script>

<style></style>
