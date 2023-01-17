<template>
  <h1 id="examples" class="pt-14 -mt-14">Examples</h1>
  <Grid
    v-for="[name, boardData] of boards"
    :key="name"
    :type="boardData.type"
    :tiles="boardData.tiles"
    :width="boardData.width"
    :height="boardData.height"
    class="bg-light first-of-type:mt-0 mt-4"
    @click="loadBoard(name)"
  />
</template>

<script lang="ts">
import { BoardData, boards } from "@/boards";
import Grid from "@/components/Grid.vue";
import { defineComponent } from "vue";
import { useBoard } from "@/use-board";

export default defineComponent({
  name: "Examples",

  components: {
    Grid,
  },

  setup() {
    const { loadBoard } = useBoard();

    const boardData: [keyof typeof boards, BoardData][] = Object.entries(
      boards
    ).map(([name, board]) => [name as keyof typeof boards, board()]);

    return {
      loadBoard,
      boards: boardData,
    };
  },
});
</script>
