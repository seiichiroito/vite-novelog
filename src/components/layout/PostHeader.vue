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
        {{ submitText }}
      </button>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  submitText: String,
});

const emit = defineEmits(["onCancel", "onSubmit"]);

const cancelHandler = () => {
  emit("onCancel");
};

const submitHandler = () => {
  emit("onSubmit");
};
</script>

<style></style>
