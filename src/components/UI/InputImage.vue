<template>
  <input
    type="file"
    accept="image/png, image/jpeg, image/jpg"
    @change="changeImageHandler"
    hidden
    ref="fileRef"
  />
</template>

<script setup>
import { ref } from "@vue/reactivity";

// const props = defineProps(["fileRef"]);
const emit = defineEmits(["onChange"]);

const mimeTypes = ["image/png", "image/jpeg", "image/jpg"];
const maxSize = 5 * 1024 * 1024;

const fileRef = ref(null);

const click = () => {
  fileRef.value.click();
};

defineExpose({
  click,
});

const changeImageHandler = (e) => {
  const [file] = e.target.files;

  if (!file) {
    return;
  }

  //   File Type validate

  if (!mimeTypes.includes(file.type)) {
    return;
  }

  // Size validate
  if (file.size > maxSize) {
    return;
  }

  emit("onChange", file);
};
</script>

<style></style>
