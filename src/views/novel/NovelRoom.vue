<template>
  <Room
    :room="delayNovel"
    @onSubmit="submitHandler"
    :messenger="novel?.owner"
    novelPage
    :isPausing="isPausing"
    @onPause="pauseHandler"
    @onPlay="playHandler"
    @onForward="forwardHandler"
  />
</template>

<script setup>
const props = defineProps({
  novelId: String,
});
import Room from "../../components/message/Room.vue";
import {
  getDocument,
  getCollection,
  getDocumentRef,
  useCollection,
} from "../../composables/firestore";

import { getUser } from "../../composables/auth";
import { computed, ref } from "@vue/reactivity";
import { watch, watchEffect } from "@vue/runtime-core";
import { useDocument } from "../../composables/firestore";
import { v4 as uuid } from "uuid";
const { currentUser } = getUser();

const { docRef: currentUserRef } = getDocumentRef(
  "users",
  currentUser.value.uid
);
const { document: novel, isPending } = getDocument("novels", props.novelId);

const isPausing = ref(false);
const delayNovel = ref(null);

watch(isPending, () => {
  if (isPending.value) {
    return;
  }

  delayNovel.value = {
    ...novel.value,
    messages: [],
  };
});
const currentIndex = ref(0);
let timer;
watchEffect(() => {
  if (isPending.value) {
    return;
  }

  if (isPausing.value) {
    clearTimeout(timer);
    return;
  }

  if (currentIndex.value >= novel.value.messages.length) {
    return;
  }

  timer = setTimeout(() => {
    delayNovel.value = {
      ...novel.value,
      messages: [
        ...delayNovel.value.messages,
        novel.value.messages[currentIndex.value],
      ],
    };
    currentIndex.value += 1;
  }, 3000);
});
const { updateField } = useDocument("rooms", props.roomId);

const submitHandler = async (text) => {
  try {
    await updateField({
      id: uuid(),
      body: text,
      senderRef: currentUserRef.value,
    });
  } catch (err) {
    console.log(err);
  }
};

// Play and Pause
const pauseHandler = () => {
  isPausing.value = true;
};

const playHandler = () => {
  isPausing.value = false;
};

const forwardHandler = () => {
  if (isPending.value) {
    return;
  }

  if (currentIndex.value >= novel.value.messages.length) {
    return;
  }
  clearTimeout(timer);
  delayNovel.value = {
    ...novel.value,
    messages: [
      ...delayNovel.value.messages,
      novel.value.messages[currentIndex.value],
    ],
  };
  currentIndex.value += 1;
};
</script>

<style></style>
