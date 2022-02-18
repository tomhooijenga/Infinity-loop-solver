<template>
  <div class="board-area">
    <component
      :is="`${board.type}-grid`"
      :tiles="board.tiles"
      :x="board.width"
      :y="board.height"
      @change="nextTile"
      class="board"
    />
  </div>
  <section class="buttons">
    <button
      type="button"
      class="button"
      @click="scrambleBoard"
      :disabled="isRunning"
    >
      Scramble
    </button>
    <button
      type="button"
      class="button"
      @click="solveBoard"
      :disabled="isRunning"
    >
      Solve
    </button>
    <button
      type="button"
      class="button"
      @click="isRunning = false"
      :disabled="!isRunning"
    >
      Stop
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { BoardData, solve } from "@/boards";
import HexGrid from "@/components/hex/Grid.vue";
import SquareGrid from "@/components/square/Grid.vue";
import { useBoard } from "@/use-board";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import * as hex from "@/lib/solver/hex/tiles";
import * as sq from "@/lib/solver/square/tiles";
import { None } from "@/lib/base/None";
import { useSettings } from "@/use-settings";

const order: Record<BoardData["type"], TileConstructor[]> = {
  hex: [
    None,
    hex.End,
    hex.TurnS,
    hex.TurnL,
    hex.Line,
    hex.Junction,
    hex.CheckL,
    hex.CheckR,
    hex.Triangle,
    hex.Diamond,
    hex.Square,
    hex.Knuckles,
    hex.Star,
  ],
  square: [None, sq.End, sq.Line, sq.Turn, sq.Junction, sq.Cross],
};

export default defineComponent({
  name: "BoardArea",

  components: {
    HexGrid,
    SquareGrid,
  },

  setup() {
    const { board, setTile, scrambleBoard } = useBoard();
    const { settings } = useSettings();

    function sleep(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const isRunning = ref(false);

    async function solveBoard() {
      const progress = solve(board);

      isRunning.value = true;

      while (isRunning.value) {
        board.tiles = [...board.tiles];
        const start = Date.now();
        if (progress.next().done) {
          break;
        }

        const delay = settings.delay - (Date.now() - start);
        if (delay > 0) {
          await sleep(delay);
        }
      }

      isRunning.value = false;
    }

    function nextTile(index: number, tile: Tile, direction: -1 | 1): void {
      const typeOrder = order[board.type];
      let typeIndex =
        (typeOrder.indexOf(tile.constructor as TileConstructor) + direction) %
        typeOrder.length;
      if (typeIndex < 0) {
        typeIndex += typeOrder.length;
      }
      const TileType = typeOrder[typeIndex];

      setTile(
        index,
        new TileType({
          solved: true,
          x: tile.x,
          y: tile.y,
        })
      );
    }

    return {
      board,
      scrambleBoard,
      solveBoard,
      nextTile,
      isRunning,
    };
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/theme";

.board-area {
  background: $board-bg;
  grid-area: board;
  min-height: 0;
}

.board {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}

.buttons {
  grid-area: controls;
  padding: 1rem;
  text-align: center;
}
</style>
