<template>
  <div class="h-full flex flex-col justify-center items-center gap-12">
    <h2 class="text-center text-2xl">{{ buttonText }}</h2>
    <div
      class="w-3/4 max-w-xs border border-green-300 shadow-md p-4 grid gap-4"
    >
      <form class="grid gap-4" @submit.prevent="submitHandler">
        <input
          v-if="displayName"
          type="text"
          placeholder="display name"
          v-model="formData.displayName"
          class="
            border border-gray-500
            py-2
            px-3
            focus:outline-none focus:ring-2 focus:ring-green-300
          "
        />
        <input
          v-if="email"
          type="email"
          placeholder="email"
          v-model="formData.email"
          class="
            border border-gray-500
            py-2
            px-3
            focus:outline-none focus:ring-2 focus:ring-green-300
          "
        />
        <input
          v-if="password"
          type="password"
          placeholder="password"
          v-model="formData.password"
          class="
            border border-gray-500
            py-2
            px-3
            focus:outline-none focus:ring-2 focus:ring-green-300
          "
        />

        <button
          type="submit"
          class="
            mt-4
            border border-green-500
            py-1
            focus:outline-none focus:ring-2 focus:ring-green-300
          "
        >
          {{ buttonText }}
        </button>
      </form>
      <div class="text-center" v-if="buttonText === 'Login'">
        <p>No account yet?</p>
        <router-link
          :to="{ name: 'Signup' }"
          type="button"
          class="text-green-600 p-2 appearance-none"
          >Signup</router-link
        >
      </div>
      <div class="text-center" v-else>
        <p>Already have account?</p>
        <router-link
          :to="{ name: 'Login' }"
          type="button"
          class="text-green-600 p-2"
          >Login</router-link
        >
      </div>
      <p class="text-center">or</p>
      <div class="flex justify-center gap-4 text-4xl">
        <button class="p-2" @click="submitOAuthHandler('google')">
          <i class="pi pi-google text-2xl text-brand-google"></i>
        </button>
        <button class="p-2" @click="submitOAuthHandler('twitter')">
          <i class="pi pi-twitter text-2xl text-brand-twitter"></i>
        </button>
        <button class="p-2" @click="submitOAuthHandler('github')">
          <i class="pi pi-github text-2xl text-brand-github"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { useSignup } from "../../composables/auth";

const props = defineProps({
  buttonText: String,
  displayName: Boolean,
  email: Boolean,
  password: Boolean,
});

const emit = defineEmits(["onSubmit"]);

const { error, isPending, signupWithOAuth } = useSignup();

const formData = ref({});

if (props.displayName) {
  formData.value.displayName = "";
}
if (props.email) {
  formData.value.email = "";
}
if (props.password) {
  formData.value.password = "";
}

// Methods
const submitHandler = () => {
  emit("onSubmit", formData);
};

const submitOAuthHandler = async (providerName) => {
  try {
    const user = await signupWithOAuth(providerName);
    console.log(user);
  } catch (err) {
    console.log(err);
  }
};
</script>

<style></style>
