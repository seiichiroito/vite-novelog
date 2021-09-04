<template>
  <PostHeader
    @onSubmit="submitHandler"
    @onCancel="cancelHandler"
    submitText="save"
  />

  <main class="max-w-3xl mx-auto">
    <div class="relative h-28 p-8">
      <div class="absolute inset-0 bg-gray-300"></div>
      <div class="relative flex gap-4">
        <img
          v-if="formData.photoURL"
          :src="formData.photoURL"
          :alt="currentUser?.displayName"
          class="w-12 h-12 rounded-full"
        />
        <img
          v-else
          :src="defaultProfile"
          alt="default"
          class="w-12 h-12 rounded-full"
        />
        <div
          class="
            w-12
            h-12
            absolute
            flex
            justify-center
            bg-backdrop
            rounded-full
            cursor-pointer
          "
          @click="clickImageHandler"
        >
          <PhotographIcon class="w-8 text-gray-800" />
          <InputImage @onChange="changeImageHandler" ref="imageFileRef" />
        </div>
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
    </form>
  </main>
</template>

<script setup>
import { getUser } from "../../composables/auth";
import { useRouter } from "vue-router";
import defaultProfile from "../../assets/default-profile.jpeg";
import { ref } from "@vue/reactivity";
import { useDocument, getDocument } from "../../composables/firestore";
import { useStorage } from "../../composables/storage";
import { updateProfile } from "@firebase/auth";
import { watch } from "@vue/runtime-core";
import { PhotographIcon } from "@heroicons/vue/outline";
import PostHeader from "../../components/layout/PostHeader.vue";
import InputImage from "../../components/UI/InputImage.vue";

const { currentUser } = getUser();

const { updateDocument, error } = useDocument("users", currentUser.value.uid);
const { document: user } = getDocument("users", currentUser.value.uid);

const formData = ref({
  displayName: currentUser.value.displayName,
  bio: "",
  photoURL: currentUser.value.photoURL,
});

const isPending = ref(false);

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

const { url, filePath, uploadImage } = useStorage("profiles");
const submitHandler = async () => {
  const { displayName, file, bio } = formData.value;

  isPending.value = true;

  try {
    //   Upload Image
    if (!file) {
      //   Update Auth user profile
      await updateProfile(currentUser.value, {
        displayName: displayName,
      });
      // Update Firebase user profile
      await updateDocument({
        displayName: displayName,
        bio: bio,
      });
      isPending.value = false;
      router.go(-1);

      return;
    }

    await uploadImage(file, currentUser.value.uid);

    //   Update Auth user profile
    await updateProfile(currentUser.value, {
      displayName: displayName,
      photoURL: url.value,
    });

    // Update Firebase user profile
    await updateDocument({
      displayName: displayName,
      bio: bio,
      photoURL: url.value,
      photoURLPath: filePath.value,
    });

    isPending.value = false;
    if (error.value) {
      throw new Error(error.value);
    }
    router.go(-1);
  } catch (err) {
    isPending.value = false;

    console.log(err);
  }
};

// Image
const imageFileRef = ref(null);

const clickImageHandler = () => {
  imageFileRef.value.click();
};

const mimeTypes = ["image/png", "image/jpeg", "image/jpg"];
const maxSize = 5 * 1024 * 1024;

const changeImageHandler = (file) => {
  formData.value.file = file;

  formData.value.photoURL = URL.createObjectURL(file);
};
</script>

<style></style>
