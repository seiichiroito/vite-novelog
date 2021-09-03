<template>
  <div class="p-4 grid gap-12">
    <!-- Display characters -->
    <div class="grid gap-4">
      <CharacterCard
        v-for="character in novel.characters"
        :key="character.id"
        :character="character"
        @onSelect="selectCardHandler"
        :mode="selectedId === character.id ? 'edit' : null"
        @onEditSubmit="editCharacterHandler"
        @onDeleteSubmit="deleteCharacterHandler"
      />
    </div>

    <!-- Edit chracter or create character -->
    <CharacterCard mode="new" @onAddSubmit="addCharacterHandler" />
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { onUpdated } from "@vue/runtime-core";
import CharacterCard from "./CharacterCard.vue";

const props = defineProps({
  novel: {
    type: Object,
  },
});
const selectedId = ref(null);

const emit = defineEmits(["addCharacter", "editCharacter", "deleteCharacter"]);

const selectCardHandler = (id) => {
  selectedId.value = id;
};

const addCharacterHandler = (characterData) => {
  emit("addCharacter", characterData);
};

const editCharacterHandler = (characterData) => {
  emit("editCharacter", characterData);
};

const deleteCharacterHandler = (id) => {
  emit("deleteCharacter", id);
};
</script>

<style></style>
