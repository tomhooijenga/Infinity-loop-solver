<template>
  <sidebar />
  <board-area />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import BoardArea from "@/components/BoardArea.vue";
import { useBoard } from "@/use-board";

export default defineComponent({
  name: "App",
  components: {
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

<style lang="scss">
@import "@/assets/global";
</style>
