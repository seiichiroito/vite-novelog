<template>
  <PostHeader
    @onSubmit="submitHandler"
    @onCancel="cancelHander"
    submitText="post"
  />
  <TabNav :tabs="tabs" :currentTab="currentTab" @onChange="changeTabHandler" />
  <keep-alive>
    <CharacterWindow
      v-if="currentTab === 'character'"
      :novel="novelData"
      @addCharacter="addCharacterHandler"
      @editCharacter="editCharacterHandler"
      @deleteCharacter="deleteCharacterHandler"
    />
    <ChatWindow
      v-else-if="currentTab === 'chat'"
      :novel="novelData"
      @onInputSubmit="inputHandler"
    />
    <DetailsWindow v-else @onChange="changeDetailsHandler" />
  </keep-alive>
</template>

<script setup>
import { computed, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import PostHeader from "../../components/layout/PostHeader.vue";
import CharacterWindow from "../../components/novel/CharacterWindow.vue";
import ChatWindow from "../../components/novel/ChatWindow.vue";
import DetailsWindow from "../../components/novel/DetailsWindow.vue";
import { v4 as uuid } from "uuid";
import { useStorage } from "../../composables/storage";
import { useCollection } from "../../composables/firestore";
import { getUser } from "../../composables/auth";
import { getDocumentRef } from "../../composables/firestore";
import TabNav from "../../components/layout/TabNav.vue";

const router = useRouter();

const tabs = ref(["character", "chat", "details"]);
const currentTab = ref(tabs.value[0]);

const novelData = ref({
  messages: [],
  characters: [],
  title: "",
  genres: [],
});

const cancelHander = () => {
  router.go(-1);
};
const { currentUser } = getUser();
const { docRef: currentUserRef } = getDocumentRef(
  "users",
  currentUser.value.uid
);

const isPending = ref(false);

const submitHandler = async () => {
  isPending.value = true;

  const uploadedCharacters = await Promise.all(
    novelData.value.characters.map(async (character) => {
      const { url, filePath, uploadImage } = useStorage("characters");
      const { addDocumentWithId, error } = useCollection("characters");

      if (!character.file) {
        try {
          const resRef = await addDocumentWithId(
            {
              displayName: character.displayName,
              bio: character.bio,
              owner: currentUserRef.value,
            },
            character.id
          );
          return {
            id: character.id,
            ref: resRef,
          };
        } catch (err) {
          console.log(error);
        }
      } else {
        try {
          await uploadImage(character.file, character.id);
          const resRef = await addDocumentWithId(
            {
              displayName: character.displayName,
              bio: character.bio,
              photoURL: url.value,
              photoURLPath: filePath.value,
              owner: currentUserRef.value,
            },
            character.id
          );

          return {
            id: character.id,
            ref: resRef,
          };
        } catch (err) {
          console.log(error);
        }
      }
    })
  );

  // uploadedCharacters
  const formattedMessages = novelData.value.messages.map((message) => {
    const sender = uploadedCharacters.find((character) => {
      return character.id === message.charId;
    });

    return {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      senderRef: sender.ref,
    };
  });

  const { addDocument, error } = useCollection("novels");
  try {
    const memberRefs = uploadedCharacters.map((member) => {
      return member.ref;
    });
    await addDocument({
      owner: currentUserRef.value,
      members: memberRefs,
      messages: formattedMessages,
      genre: novelData.value.genres,
      title: novelData.value.title,
      favorited: [],
    });
    router.replace({ name: "Home" });
  } catch (err) {
    console.log(error.value);
  }
};

const changeTabHandler = (tabName) => {
  currentTab.value = tabName;
};

//? Characters
const addCharacterHandler = (characterData) => {
  novelData.value.characters.push({
    ...characterData.value,
    id: uuid(),
  });
};

const editCharacterHandler = (characterData) => {
  const updatedIndex = novelData.value.characters.findIndex((character) => {
    return character.id === characterData.value.id;
  });

  novelData.value.characters[updatedIndex] = characterData.value;
};

const deleteCharacterHandler = (id) => {
  novelData.value.characters = novelData.value.characters.filter(
    (character) => {
      return character.id !== id;
    }
  );

  novelData.value.messages = novelData.value.messages.filter((message) => {
    return message.charId !== id;
  });
};

//? Chat
const inputHandler = (inputData) => {
  novelData.value.messages.push({
    ...inputData,
    id: uuid(),
  });
};

//? Details
const changeDetailsHandler = (detailsData) => {
  novelData.value = {
    ...novelData.value,
    title: detailsData.title,
    genres: detailsData.genres,
  };
};
</script>

<style></style>
