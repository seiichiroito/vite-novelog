<template>
  <div
    class="rounded-xl p-2 flex gap-4 border border-black items-center"
    :class="{ 'cursor-pointer': mode !== 'new', 'border-green-400': editting }"
    @click="selectHandler"
  >
    <div class="flex-shrink-0">
      <img
        v-if="mode"
        class="w-12 h-12 rounded-full object-cover"
        :src="characterForm.photoURL"
        alt="icon"
      />
      <img
        v-else
        class="w-12 h-12 rounded-full object-cover"
        :src="character.photoURL"
        alt="icon"
      />
    </div>
    <div class="grid gap-4 flex-1" v-if="mode">
      <input
        v-if="mode"
        type="text"
        v-model="characterForm.displayName"
        class="border-b p-1"
        placeholder="name"
      />
      <textarea
        class="border-b p-1"
        v-model="characterForm.bio"
        placeholder="explanation (option)"
      ></textarea>

      <div class="flex justify-end gap-2">
        <button
          v-if="mode === 'edit'"
          class="border px-4 py-1 border-red-400 rounded-full text-red-400"
          @click="deleteCharacterHandler"
        >
          Delete
        </button>
        <button
          v-if="mode === 'edit'"
          class="border px-4 py-1 border-blue-400 rounded-full text-blue-400"
          @click="editCharacterHandler"
        >
          Save
        </button>
        <button
          v-if="mode === 'new'"
          class="border px-4 py-1 border-blue-400 rounded-full text-blue-400"
          @click="addCharacterHandler"
        >
          Add
        </button>
      </div>
    </div>
    <div class="grid gap-4 flex-1" v-else>
      <p>{{ character.displayName }}</p>
      <!-- <p v-if="mode">{{ character.bio }}</p> -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";

const props = defineProps({
  mode: String,
  character: {
    type: Object,
    default: () => ({
      name: "",
      bio: "",
      photoURL: "https://placekitten.com/200/300",
      file: null,
      id: null,
    }),
  },
});

const emit = defineEmits([
  "onAddSubmit",
  "onEditSubmit",
  "onSelect",
  "onDeleteSubmit",
]);

const characterForm = ref({
  id: props.character.id,
  displayName: props.character.displayName,
  bio: props.character.bio,
  photoURL: props.character.photoURL,
  file: null,
});

const editting = computed(() => {
  if (
    props.character.displayName !== characterForm.value.displayName ||
    props.character.bio !== characterForm.value.bio
  ) {
    return true;
  }
  return false;
});

const addCharacterHandler = () => {
  emit("onAddSubmit", characterForm);
  characterForm.value = {
    ...characterForm.value,
    displayName: "",
    bio: "",
  };
};

const editCharacterHandler = () => {
  emit("onEditSubmit", characterForm);
};

const selectHandler = () => {
  emit("onSelect", props.character.id);
};

const deleteCharacterHandler = () => {
  emit("onDeleteSubmit", props.character.id);
};
</script>

<style></style>
