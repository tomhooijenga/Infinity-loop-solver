<template>
  <sidebar />
  <board-area />
  <logs />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import Logs from "@/components/Logs.vue";
import BoardArea from "@/components/BoardArea.vue";
import { useBoard } from "@/use-board";

export default defineComponent({
  name: "App",
  components: {
    Logs,
    BoardArea,
    Sidebar,
  },
  setup() {
    const { loadBoard, generateBoard } = useBoard();

    loadBoard("heart");

    return {
      generateBoard,
    };
  },
});
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

h1 {
  @apply text-3xl mt-6 mb-4;
}

h2 {
  @apply text-2xl mt-6 mb-2;
}

p {
  @apply text-neutral/70 mb-2;
}

a {
  @apply underline;
}
</style>
