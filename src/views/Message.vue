<template>
  <Layout>
    <div v-if="Object.entries(messages).length">
      <MessageCard
        v-for="[messenger, mes] in Object.entries(messages)"
        :key="messenger"
        :message="mes[0]"
        :messengerId="messenger"
      />
    </div>
    <div v-else class="h-full grid justify-center items-center">
      <p class="text-gray-500">
        When you start chatting, it will be showed here.
      </p>
    </div>
  </Layout>
</template>

<script setup>
import Layout from "../components/layout/Layout.vue";
import MessageCard from "../components/message/MessageCard.vue";
import { getCollection, getDocumentRef } from "../composables/firestore";
import { getUser } from "../composables/auth";
import { computed } from "@vue/reactivity";
const { currentUser } = getUser();

// const userRef = doc(collection(db, "users"), currentUser.value.uid);
const userRef = getDocumentRef("users", currentUser.value.uid);

const { documents: sentMessages, error: sendingError } = getCollection(
  "messages",
  ["sender", "==", userRef]
);
const { documents: receivedMessages, error: receivedError } = getCollection(
  "messages",
  ["receiver", "==", userRef]
);

const messages = computed(() => {
  const messages = {};
  sentMessages.value.map((sentMessage) => {
    if (!messages[sentMessage.receiver.id]) {
      messages[sentMessage.receiver.id] = [];
    }
    messages[sentMessage.receiver.id].push(sentMessage);
  });

  receivedMessages.value.map((receivedMessage) => {
    if (!messages[receivedMessage.sender.id]) {
      messages[receivedMessage.sender.id] = [];
    }
    messages[receivedMessage.sender.id].push(receivedMessage);
  });

  return messages;
});
</script>

<style></style>
