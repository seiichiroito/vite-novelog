<template>
  <Layout>
    <div className="h-full grid items-center content-center gap-4 mx-8">
      <div class="border border-black rounded-sm grid shadow-lg">
        <button
          class="py-3 border-b border-black disabled:opacity-25"
          @click="changeModeHandler('email')"
          :disabled="!isEditable"
        >
          Change Email
        </button>
        <button
          class="py-3 border-b border-black disabled:opacity-25"
          @click="changeModeHandler('password')"
          :disabled="!isEditable"
        >
          Change Password
        </button>
        <button class="py-3" @click="logoutHandler">Logout</button>
      </div>
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
  </Layout>
</template>

<script setup>
import {
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from "@firebase/auth";
import { computed, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

import Layout from "../components/layout/Layout.vue";
import { uselogout, getUser } from "../composables/auth";

const { error, isPending, logout } = uselogout();
const { currentUser } = getUser();
const router = useRouter();

const mode = ref(null);
const email = ref(null);
const password = ref(null);

const logoutHandler = async () => {
  mode.value = null;
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
  if (currentUser.value.providerData[0].providerId === "password") {
    return true;
  } else {
    return false;
  }
});

const submitEmailHandler = async () => {
  try {
    await updateEmail(currentUser.value, email.value);

    await sendEmailVerification(currentUser.value);
    email.value = "";
    router.push({ name: "EmailConfirmation" });
  } catch (err) {
    console.log(err.message);
  }
};
const submitPasswordHandler = async () => {
  try {
    await updatePassword(currentUser.value, password.value);
    password.value = "";
    console.log("success to update password");
  } catch (err) {
    console.log(err.message);
  }
};
</script>

<style></style>
