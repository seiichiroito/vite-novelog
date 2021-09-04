<template>
  <PostHeader
    @onSubmit="submitHandler"
    @onCancel="cancelHander"
    submitText="post"
  />
  <div class="grid grid-cols-3 h-12">
    <button
      class="py-2 txt-center border-b-2"
      :class="{ 'border-green-300': currentTab === 'character' }"
      @click="tabChangeHandler('character')"
    >
      Characters
    </button>
    <button
      class="py-2 txt-center border-b-2"
      @click="tabChangeHandler('chat')"
      :class="{ 'border-green-300': currentTab === 'chat' }"
    >
      Chat
    </button>
    <button
      class="py-2 txt-center border-b-2"
      @click="tabChangeHandler('details')"
      :class="{ 'border-green-300': currentTab === 'details' }"
    >
      Details
    </button>
  </div>
  <keep-alive>
    <CharacterWindow
      v-if="currentTab === 'character'"
      :novel="novelData"
      @addCharacter="addCharacterHandler"
      @editCharacter="editCharacterHandler"
      @deleteCharacter="deleteCharacterHandler"
    />
    <ChatWindow
      v-else-if="currentTab === 'chat'"
      :novel="novelData"
      @onInputSubmit="inputHandler"
    />
    <DetailsWindow v-else @onChange="changeDetailsHandler" />
  </keep-alive>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import PostHeader from "../../components/layout/PostHeader.vue";
import CharacterWindow from "../../components/novel/CharacterWindow.vue";
import ChatWindow from "../../components/novel/ChatWindow.vue";
import DetailsWindow from "../../components/novel/DetailsWindow.vue";
import { v4 as uuid } from "uuid";
const router = useRouter();

const currentTab = ref("character");
const novelData = ref({
  messages: [],
  characters: [],
  title: "",
  genres: [],
  id: uuid(),
  createdAt: "",
});

const cancelHander = () => {
  router.go(-1);
};

const submitHandler = () => {
  console.log(novelData);
};

const tabChangeHandler = (tabName) => {
  currentTab.value = tabName;
};

//? Characters
const addCharacterHandler = (characterData) => {
  novelData.value.characters.push({
    ...characterData.value,
    id: uuid(),
  });
};

const editCharacterHandler = (characterData) => {
  const updatedIndex = novelData.value.characters.findIndex((character) => {
    return character.id === characterData.value.id;
  });

  novelData.value.characters[updatedIndex] = characterData.value;
};

const deleteCharacterHandler = (id) => {
  novelData.value.characters = novelData.value.characters.filter(
    (character) => {
      return character.id !== id;
    }
  );
};

//? Chat
const inputHandler = (inputData) => {
  const sender = novelData.value.characters.find((character) => {
    return character.id === inputData.charId;
  });

  novelData.value.messages.push({
    body: inputData.body,
    createdAt: inputData.createdAt,
    sender,
    id: uuid(),
  });
};

//? Details
const changeDetailsHandler = (detailsData) => {
  novelData.value = {
    ...novelData.value,
    title: detailsData.title,
    genres: detailsData.genres,
  };
};
</script>

<style></style>
