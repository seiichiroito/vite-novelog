<template>
  <Layout>
    <div v-if="formattedRooms?.length">
      <RoomCard v-for="room in formattedRooms" :key="room.id" :room="room" />
    </div>

    <div v-else class="h-full grid justify-center items-center">
      <p class="text-gray-300">
        When you start chatting, it will be showed here.
      </p>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "../components/layout/Layout.vue";
import RoomCard from "../components/message/RoomCard.vue";
import { getCollection, getDocumentRef } from "../composables/firestore";
import { getUser } from "../composables/auth";
import { computed } from "@vue/reactivity";
import { formatDistanceToNow } from "date-fns";
const { currentUser } = getUser();

const { docRef: currentUserRef } = getDocumentRef(
  "users",
  currentUser.value.uid
);

const { documents: myRooms } = getCollection("rooms", [
  "owner",
  "==",
  currentUserRef.value,
]);
const { documents: subRooms } = getCollection("rooms", [
  "subOwner",
  "==",
  currentUserRef.value,
]);

const formattedRooms = computed(() => {
  return [...myRooms.value, ...subRooms.value].map((room) => ({
    ...room,
    updatedAt: formatDistanceToNow(room.updatedAt.toDate()),
  }));
});
</script>

<style></style>
