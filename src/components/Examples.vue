<template>
  <h1 id="examples" class="pt-14 -mt-14">Examples</h1>
  <component
    :is="`${boardData.type}-board`"
    v-for="[name, boardData] of boards"
    v-once
    :key="name"
    :tiles="boardData.tiles"
    :x="boardData.width"
    :y="boardData.height"
    class="bg-light first-of-type:mt-0 mt-4"
    @click="loadBoard(name)"
  />
</template>

<script lang="ts">
import { BoardData, boards } from "@/boards";
import SquareBoard from "@/components/square/Grid.vue";
import HexBoard from "@/components/hex/Grid.vue";
import { defineComponent } from "vue";
import { useBoard } from "@/use-board";

export default defineComponent({
  name: "Examples",

  components: {
    SquareBoard,
    HexBoard,
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
