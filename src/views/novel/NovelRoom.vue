<template>
  <Room
    :room="novel"
    @onSubmit="submitHandler"
    :messenger="novel?.owner"
    novelPage
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
import { watch } from "@vue/runtime-core";
import { useDocument } from "../../composables/firestore";
import { v4 as uuid } from "uuid";
const { currentUser } = getUser();

const { docRef: currentUserRef } = getDocumentRef(
  "users",
  currentUser.value.uid
);
const { document: novel } = getDocument("novels", props.novelId);

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
