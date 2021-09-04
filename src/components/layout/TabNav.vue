<template>
  <div
    class="grid h-12 sticky top-0 bg-white"
    :class="[`grid-cols-${tabs.length}`]"
  >
    <button
      v-for="tab in tabs"
      :key="tab"
      class="py-2 txt-center border-b-2 capitalize"
      :class="{ 'border-green-300': currentTab === tab }"
      @click="tabChangeHandler(tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: Array,
  currentTab: String,
});

const emit = defineEmits(["onChange"]);

const tabChangeHandler = (tabName) => {
  emit("onChange", tabName);
};
</script>

<style></style>
