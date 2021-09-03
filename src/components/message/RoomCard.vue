<template>
  <li
    className="flex border gap-4 px-4 items-center h-messageCard cursor-pointer"
  >
    <div @click="profileHandler">
      <img
        v-if="messenger?.photoURL"
        :src="messenger.photoURL"
        :alt="messenger.displayName"
        className="w-12 h-12 rounded-full object-cover"
      />
      <img
        :src="defaultProfile"
        alt="default"
        v-else
        class="w-12 h-12 rounded-full object-cover"
      />
    </div>
    <div className="flex-1 grid" @click="messageRoomHandler">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <p className="font-bold pr-2">{{ messenger?.displayName }}</p>
        </div>
        <p class="text-gray-400 text-sm">{{ room.updatedAt }}</p>
      </div>
      <div className="pt-2 text-left">
        {{ displayMessage }}
      </div>
    </div>
  </li>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getDocument } from "../../composables/firestore";
import defaultProfile from "../../assets/default-profile.jpeg";
import { getUser } from "../../composables/auth";
import { computed } from "@vue/reactivity";
const MAX_DISPLAY = 60;

const props = defineProps({
  room: Object,
});
const router = useRouter();

const { currentUser } = getUser();

let messengerRef;
if (props.room.subOwner) {
  // Private Chat

  messengerRef =
    props.room.owner.id === currentUser.value.uid
      ? props.room.subOwner
      : props.room.owner;
} else {
  // Novel
  // eslint-disable-next-line vue/no-setup-props-destructure
  messengerRef = props.room.owner;
}
const { document: messenger } = getDocument("users", messengerRef.id);

const displayMessage = computed(() => {
  const lastMessage = props.room.messages[props.room.messages.length - 1].body;
  return (
    lastMessage.slice(0, MAX_DISPLAY) +
    (lastMessage.length > MAX_DISPLAY ? "..." : "")
  );
});

const profileHandler = () => {
  router.push({ name: "Profile", params: { userId: messenger.value.id } });
};
const messageRoomHandler = () => {
  router.push({ name: "MessageRoom", params: { roomId: props.room.id } });
};
</script>

<style></style>
