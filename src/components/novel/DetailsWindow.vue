<template>
  <form
    class="py-4 px-8 grid max-w-xl mx-auto grid-cols-2 gap-4 justify-center"
  >
    <label>Title</label>
    <input
      class="border-b border-black p-1"
      type="text"
      v-model.trim="detailsData.title"
      placeholder="title"
      @change="changeHandler"
    />

    <label>Genre</label>
    <input
      class="border-b border-black p-1"
      type="text"
      v-model.trim="detailsData.genre"
      @keypress.enter="addGenreHandler"
      placeholder="press enter to add"
    />

    <div class="flex gap-4 col-span-full flex-wrap">
      <p
        class="border rounded-full px-2 py-1 flex gap-2"
        v-for="genre in detailsData.genres"
        :key="genre"
      >
        <button type="button" class="p-1" @click="deleteGenreHandler(genre)">
          <XIcon class="w-4" />
        </button>
        {{ genre }}
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { XIcon } from "@heroicons/vue/outline";

const emit = defineEmits(["onChange"]);

const detailsData = ref({
  title: "",
  genre: "",
  genres: new Set(),
});

const changeHandler = () => {
  emit("onChange", {
    title: detailsData.value.title,
    genres: Array.from(detailsData.value.genres),
  });
};

const addGenreHandler = () => {
  const { genre } = detailsData.value;

  if (detailsData.value.genres.size >= 3) {
    return;
  }
  if (genre === "") {
    return;
  }

  if (detailsData.value.genres.has(genre)) {
    return;
  }

  detailsData.value.genres.add(genre);
  detailsData.value.genre = "";
  changeHandler();
};

const deleteGenreHandler = (genre) => {
  detailsData.value.genres.delete(genre);
  changeHandler();
};
</script>

<style></style>
