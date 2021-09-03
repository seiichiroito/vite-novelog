<template>
  <BackHeader @onClick="backHandler" />
  <div class="relative h-28 p-8">
    <div class="absolute inset-0 bg-gray-300"></div>
    <div class="relative flex gap-4">
      <img
        v-if="user?.photoUrl"
        :src="user.photoUrl"
        :alt="user.displayName"
        class="w-12 h-12 rounded-full"
      />
      <img
        v-else
        :src="defaultProfile"
        alt="default"
        class="w-12 h-12 rounded-full"
      />

      <div>
        <p>{{ user?.displayName }}</p>
        <p class="text-gray-400 text-sm">@{{ user?.username }}</p>
      </div>
    </div>
  </div>
  <div class="p-4 grid gap-4">
    <p>{{ user?.bio }}</p>
    <div class="flex justify-between items-center">
      <div class="flex gap-4">
        <p>{{ user?.following.length }} following</p>
        <p>{{ follower?.length }} follower</p>
      </div>
      <button
        v-if="currentUser?.uid === user?.id"
        class="rounded-full border-green-400 border px-4 py-1"
        @click="editUserHandler"
      >
        Edit Profile
      </button>
      <div v-else class="flex gap-4">
        <button
          class="border border-black rounded-full p-2"
          @click="messageRoomHandler"
        >
          <ChatIcon class="w-4" />
        </button>
        <button
          v-if="isFollowing"
          class="rounded-full bg-green-400 text-white border px-4 py-1"
          @click="unFollowHandler"
        >
          Following
        </button>
        <button
          v-else
          class="rounded-full border-green-400 border px-4 py-1"
          @click="followHandler"
        >
          Follow
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChatIcon } from "@heroicons/vue/outline";
import BackHeader from "../../components/layout/BackHeader.vue";
import { functions } from "../../firebase/config";
import { httpsCallable } from "firebase/functions";

const props = defineProps({
  userId: String,
});
import {
  getCollection,
  getDocument,
  getDocumentRef,
  useCollection,
} from "../../composables/firestore";
import { getUser } from "../../composables/auth";
import { useRouter } from "vue-router";
import defaultProfile from "../../assets/default-profile.jpeg";
import { computed } from "@vue/reactivity";
import { Timestamp } from "@firebase/firestore";

const router = useRouter();
const { currentUser } = getUser();

const { docRef: userRef } = getDocumentRef("users", props.userId);
const { document: user } = getDocument("users", props.userId);

const { docRef: currentUserRef } = getDocumentRef(
  "users",
  currentUser.value.uid
);

const { document: currentUserDoc } = getDocument(
  "users",
  currentUser.value.uid
);

const { documents: follower } = getCollection("users", [
  "following",
  "array-contains",
  userRef.value,
]);

const backHandler = () => {
  router.go(-1);
};

const isFollowing = computed(() => {
  return currentUserDoc.value?.following.some((followingRef) => {
    return followingRef.path === userRef.value.path;
  });
});

const { documents: myRooms } = getCollection(
  "rooms",
  ["owner", "==", currentUserRef.value],
  ["subOwner", "==", userRef.value]
);

const { documents: subRooms } = getCollection(
  "rooms",
  ["subOwner", "==", currentUserRef.value],
  ["owner", "==", userRef.value]
);

const { addDocument } = useCollection("rooms");
const messageRoomHandler = async () => {
  let room = myRooms.value[0] || subRooms.value[0];
  if (!room) {
    room = await addDocument({
      owner: currentUserRef.value,
      subOwner: userRef.value,
      messages: [],
      updatedAt: Timestamp.fromDate(new Date()),
    });
  }

  router.push({ name: "MessageRoom", params: { roomId: room.id } });
};

const followHandler = async () => {
  const follow = httpsCallable(functions, "follow");
  try {
    const res = await follow({ uid: user.value.id });
    // console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const unFollowHandler = async () => {
  const unFollow = httpsCallable(functions, "unFollow");
  try {
    const res = await unFollow({ uid: user.value.id });
    // console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const editUserHandler = async () => {
  router.push({
    name: "EditProfile",
  });
};
</script>

<style></style>
