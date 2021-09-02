<template>
  <Room :room="room" @onSubmit="submitHandler" :messenger="messenger" />
</template>

<script setup>
const props = defineProps({
  roomId: String,
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
import { watch } from "@vue/runtime-core";
import { useDocument } from "../../composables/firestore";
import { v4 as uuid } from "uuid";
const { currentUser } = getUser();
const { docRef: currentUserRef } = getDocumentRef(
  "users",
  currentUser.value.uid
);
const { document: room } = getDocument("rooms", props.roomId);

const messenger = computed(() => {
  let messengerRef;
  if (!room.value) {
    return;
  }

  if (room.value.owners.length === 1) {
    // Novel
    return room.value.owners[0];
  } else {
    // Private Chat
    return room.value.owners.find((owner) => {
      return owner.id !== currentUser.value.uid;
    });
  }
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
</script>

<style></style>
