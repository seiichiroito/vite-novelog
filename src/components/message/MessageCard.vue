<template>
  <li className="flex border gap-4 px-4 items-center h-messageCard">
    <button @click="profileHandler">
      <img
        v-if="messenger"
        :src="messenger.photoUrl"
        :alt="messenger.displayName"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div v-else class="w-12 h-12 rounded-full object-cover bg-gray-300"></div>
    </button>
    <button className="flex-1 grid" @click="messageRoomHandler">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <p className="font-bold pr-2">{{ messenger?.displayName }}</p>
          <p className="text-gray-400 text-sm">@{{ messenger?.username }}</p>
        </div>
        <p className="text-gray-400 text-sm"></p>
      </div>
      <div className="pt-2 text-left">{{ message.body }}</div>
    </button>
  </li>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getDocument } from "../../composables/firestore";

const props = defineProps({
  message: Object,
  messengerId: String,
});
const router = useRouter();
const { document: messenger } = getDocument("users", props.messengerId);

const profileHandler = () => {
  router.push({ name: "Profile", params: { userId: messenger.value.id } });
};

const messageRoomHandler = () => {
  router.push({ name: "MessageRoom", params: { userId: props.messengerId } });
};
</script>

<style></style>
