<template>
  <Layout>
    <div className="h-full grid items-center content-center gap-4 mx-8">
      <div class="border border-black rounded-sm grid shadow-lg">
        <button
          class="py-3 border-b border-black disabled:opacity-25"
          @click="changeModeHandler('username')"
        >
          Change username
        </button>
        <button
          v-if="isEditable"
          class="py-3 border-b border-black disabled:opacity-25"
          @click="changeModeHandler('email')"
        >
          Change Email
        </button>
        <button
          v-if="isEditable"
          class="py-3 border-b border-black disabled:opacity-25"
          @click="changeModeHandler('password')"
        >
          Change Password
        </button>
        <button class="py-3" @click="logoutHandler">Logout</button>
      </div>
      <form
        v-if="mode === 'username'"
        class="grid gap-4"
        @submit.prevent="submitUsernameHandler"
      >
        <input
          type="text"
          class="border-b border-gray-600 p-1"
          placeholder="new username"
          v-model="username"
        />
        <button
          class="
            border border-green-400
            py-1
            px-4
            justify-self-end
            text-green-400
          "
        >
          change
        </button>
      </form>
      <form
        v-if="mode === 'email'"
        class="grid gap-4"
        @submit.prevent="submitEmailHandler"
      >
        <input
          type="email"
          class="border-b border-gray-600 p-1"
          placeholder="new email"
          v-model="email"
        />

        <button
          class="
            border border-green-400
            py-1
            px-4
            justify-self-end
            text-green-400
          "
        >
          change
        </button>
      </form>
      <form
        v-if="mode === 'password'"
        class="grid gap-4"
        @submit.prevent="submitPasswordHandler"
      >
        <input
          type="password"
          class="border-b border-gray-600 p-1"
          placeholder="new password"
          v-model="password"
        />

        <button
          class="
            border border-green-400
            py-1
            px-4
            justify-self-end
            text-green-400
          "
        >
          change
        </button>
      </form>
    </div>
    <Loading :active="isPending" :is-full-page="true" />
  </Layout>
</template>

<script setup>
import {
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from "@firebase/auth";
import { httpsCallable } from "@firebase/functions";
import { computed, ref } from "@vue/reactivity";
import { inject, watch } from "@vue/runtime-core";
import { useRouter } from "vue-router";

import Layout from "../components/layout/Layout.vue";
import { uselogout, getUser } from "../composables/auth";
import { getDocument } from "../composables/firestore";
import { functions } from "../firebase/config";
import Loading from "vue-loading-overlay";

const { error, isPending: logoutPending, logout } = uselogout();
const { currentUser } = getUser();

const setNotification = inject("setNotification");

const router = useRouter();

const mode = ref(null);
const email = ref(null);
const password = ref(null);
const username = ref(null);
const isPending = ref(false);

const { document: currentUserDoc } = getDocument(
  "users",
  currentUser.value.uid
);

watch(currentUserDoc, () => {
  if (!currentUserDoc.value) {
    return;
  }

  username.value = currentUserDoc.value.username;
  email.value = currentUserDoc.value.email;
});

const logoutHandler = async () => {
  mode.value = null;
  isPending.value = logoutPending.value;
  try {
    if (confirm("logout?")) {
      await logout();

      router.push({ name: "Login" });
    }
  } catch (err) {
    console.log(err);
  }
};

const changeModeHandler = (modeName) => {
  mode.value = modeName;
};

const isEditable = computed(() => {
  if (currentUser.value?.providerData[0].providerId === "password") {
    return true;
  } else {
    return false;
  }
});

const submitEmailHandler = async () => {
  isPending.value = true;
  try {
    await updateEmail(currentUser.value, email.value);

    await sendEmailVerification(currentUser.value);
    email.value = "";
    isPending.value = false;
    router.push({ name: "EmailConfirmation" });
  } catch (err) {
    isPending.value = false;
    setNotification({ type: "error", message: err.message });
  }
};
const submitPasswordHandler = async () => {
  isPending.value = true;

  try {
    await updatePassword(currentUser.value, password.value);
    password.value = "";
    isPending.value = false;
    setNotification({ type: "success", message: "success to update password" });
  } catch (err) {
    isPending.value = false;
    setNotification({ type: "error", message: err.message });
  }
};

const submitUsernameHandler = async () => {
  if (username.value.length < 3) {
    setNotification({
      type: "warning",
      message: "username must be longer then 3 characters",
    });
    return;
  }

  const updateUsername = httpsCallable(functions, "updateUsername");
  isPending.value = true;
  try {
    await updateUsername({ username: username.value });
    isPending.value = false;
    setNotification({ type: "success", message: "success to update username" });
  } catch (err) {
    isPending.value = false;
    setNotification({ type: "error", message: err.message });
  }
};
</script>

<style></style>
