<template>
  <Room :user="messenger" :messages="messages" @onSubmit="submitHandler" />
</template>

<script setup>
const props = defineProps({
  userId: String,
});
import Room from "../../components/Room.vue";
import {
  getDocument,
  getCollection,
  getDocumentRef,
} from "../../composables/firestore";
import { getUser } from "../../composables/auth";
import { computed } from "@vue/reactivity";
import { useCollection } from "../../composables/firestore";

const { document: messenger } = getDocument("users", props.userId);
const { currentUser } = getUser();

const currentUserRef = getDocumentRef("users", currentUser.value.uid);
const messengerRef = getDocumentRef("users", props.userId);

const { documents: sentMessages, error: sendingError } = getCollection(
  "messages",
  ["sender", "==", currentUserRef],
  ["receiver", "==", messengerRef]
);
const { documents: receivedMessages, error: receivedError } = getCollection(
  "messages",
  ["sender", "==", messengerRef],
  ["receiver", "==", currentUserRef]
);

const messages = computed(() => {
  return [...sentMessages.value, ...receivedMessages.value].sort(
    (messageA, messageB) => {
      return messageA.createdAt - messageB.createdAt;
    }
  );
});

const { addDocument, error, isPending } = useCollection("messages");

const submitHandler = async (text) => {
  try {
    const res = await addDocument({
      body: text,
      receiver: messengerRef,
      sender: currentUserRef,
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
