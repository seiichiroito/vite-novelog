<template>
  <ul class="grid gap-4">
    <li
      class="flex gap-2"
      v-for="message in formattedMessages"
      :key="message.id"
    >
      <img
        v-if="message.sender?.photoURL"
        :src="message.sender?.photoURL"
        :alt="message.sender?.displayName"
        class="w-8 h-8 rounded-full"
      />
      <img
        v-else
        :src="defaultProfile"
        alt="default"
        class="w-8 h-8 rounded-full"
      />

      <div class="grid gap-1 justify-items-start">
        <p>{{ message.sender?.displayName }}</p>
        <div class="flex items-end gap-2">
          <p class="speech-bubble bg-white rounded-2xl p-2 whitespace-pre-wrap">
            {{ message.body }}
          </p>
          <p class="text-xs text-gray-500 flex-shrink-0">
            {{ message.createdAt }}
          </p>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import defaultProfile from "../../assets/default-profile.jpeg";
import { format } from "date-fns";
import { onUpdated } from "@vue/runtime-core";

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
});

const formattedMessages = computed(() => {
  return props.messages.map((message) => ({
    ...message,
    createdAt: format(message.createdAt.toDate(), "HH:mm"),
  }));
});
</script>

<style></style>
