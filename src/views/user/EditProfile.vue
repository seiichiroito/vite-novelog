<template>
  <header class="h-12 sticky top-0 shadow z-10 bg-white">
    <div
      class="h-full px-4 max-w-3xl mx-auto flex items-center justify-between"
    >
      <button class="p-3" @click="cancelHandler">Cancel</button>
      <button
        class="px-4 py-1 border border-green-500 text-green-500 rounded-full"
        @click="submitHandler"
      >
        save
      </button>
    </div>
  </header>

  <main class="max-w-3xl mx-auto">
    <div class="relative h-28 p-8">
      <div class="absolute inset-0 bg-gray-300"></div>
      <div class="relative flex gap-4">
        <img
          v-if="currentUser?.photoUrl"
          :src="currentUser.photoUrl"
          :alt="currentUser?.displayName"
          class="w-12 h-12 rounded-full"
        />
        <img
          v-else
          :src="defaultProfile"
          alt="default"
          class="w-12 h-12 rounded-full"
        />
      </div>
    </div>
    <form class="p-8 grid gap-8">
      <div class="flex gap-4 justify-between">
        <label htmlFor="displayName">display Name</label>
        <input
          type="text"
          class="border-b p-2"
          v-model="formData.displayName"
        />
      </div>
      <div class="flex gap-4 justify-between">
        <label htmlFor="bio">bio</label>
        <textarea id="bio" class="border-b p-2" v-model="formData.bio" />
      </div>
      <div class="flex gap-4 justify-between">
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="text"
          class="border-b p-2"
          v-model="formData.image"
        />
      </div>
    </form>
  </main>
</template>

<script setup>
import { getUser } from "../../composables/auth";
import { useRouter } from "vue-router";
import defaultProfile from "../../assets/default-profile.jpeg";
import { ref } from "@vue/reactivity";
import { useDocument, getDocument } from "../../composables/firestore";
import { updateProfile } from "@firebase/auth";
import { watch } from "@vue/runtime-core";
const { currentUser } = getUser();

const { updateDocument, error } = useDocument("users", currentUser.value.uid);
const { document: user } = getDocument("users", currentUser.value.uid);

const formData = ref({
  displayName: currentUser.value.displayName,
  bio: "",
  image: currentUser.value.photoURL,
});

const props = defineProps({
  userId: String,
});
const router = useRouter();

const cancelHandler = () => {
  router.go(-1);
};

watch(user, () => {
  if (!user) {
    return;
  }

  formData.value.bio = user.value.bio;
});

const submitHandler = async () => {
  try {
    //   Update Auth user profile
    await updateProfile(currentUser.value, {
      displayName: formData.value.displayName,
      photoURL: formData.value.image,
    });

    // Update Firebase user profile
    await updateDocument({
      displayName: formData.value.displayName,
      bio: formData.value.bio,
      photoUrl: formData.value.image,
    });
    if (error.value) {
      throw new Error(error.value);
    }
    router.go(-1);
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
