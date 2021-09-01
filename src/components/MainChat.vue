<template>
  <div class="p-2">
    <ul class="grid gap-4">
      <li class="flex gap-2" v-for="message in messages" :key="message.id">
        <img
          v-if="message.sender.photoUrl"
          :src="message.sender.photoUrl"
          :alt="message.sender.displayName"
          class="w-8 h-8 rounded-full"
        />
        <img
          v-else
          :src="defaultProfile"
          alt="default"
          class="w-8 h-8 rounded-full"
        />

        <div class="grid gap-1">
          <p>{{ message.sender.displayName }}</p>
          <p class="speech-bubble bg-white rounded-2xl p-2">
            {{ message.body }}
          </p>
        </div>
      </li>

      <div ref="bottom"></div>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import defaultProfile from "../assets/default-profile.jpeg";

const props = defineProps({
  messages: Array,
});

const bottom = ref(null);
</script>

<style></style>
