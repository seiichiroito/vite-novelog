<template>
  <li
    className="flex border gap-4 px-4 items-center h-messageCard cursor-pointer"
    @click="messageRoomHandler"
  >
    <div @click="profileHandler">
      <img
        v-if="messenger?.photoUrl"
        :src="messenger.photoUrl"
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
    <div className="flex-1 grid">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <p className="font-bold pr-2">{{ messenger?.displayName }}</p>
        </div>
        <p class="text-gray-400 text-sm">{{ room.updatedAt }}</p>
      </div>
      <div className="pt-2 text-left">
        {{ room.title || room.messages[room.messages.length - 1].body }}
      </div>
    </div>
  </li>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getDocument, getDocumentRef } from "../../composables/firestore";
import defaultProfile from "../../assets/default-profile.jpeg";
import { getUser } from "../../composables/auth";
const props = defineProps({
  room: Object,
});
const router = useRouter();

const { currentUser } = getUser();
const { docRef: currentUserRef } = getDocumentRef(
  "users",
  currentUser.value.uid
);

let messengerRef;
if (props.room.subOwner) {
  // Private Chat

  messengerRef =
    props.room.owner.path === currentUserRef.value.path
      ? props.room.subOwner
      : props.room.owner;
} else {
  // Novel
  // eslint-disable-next-line vue/no-setup-props-destructure
  messengerRef = props.room.owner;
}
const { document: messenger } = getDocument("users", messengerRef.id);

const messageRoomHandler = () => {
  router.push({ name: "MessageRoom", params: { roomId: props.room.id } });
};
</script>

<style></style>
