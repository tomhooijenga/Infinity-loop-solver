<template>
  <div class="grid [grid-template-rows:1fr_auto] flex-1 bg-light min-h-0">
    <TriangleGrid
      v-bind="board"
      ref="grid"
      @change="nextTile"
      @hover="highlightTile($event)"
    />

    <section class="flex flex-wrap bg-dark p-2">
      <Button :disabled="isRunning" @click="generateBoard"> Generate </Button>
      <span class="mx-auto space-x-2">
        <Button :disabled="isRunning" @click="scrambleBoard"> Scramble </Button>
        <Button :disabled="isRunning" @click="solveBoard"> Solve </Button>
      </span>
      <Button :disabled="!isRunning" @click="isRunning = false"> Stop </Button>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { BoardData, solve } from "@/boards";
import Button from "@/components/Button.vue";
import TriangleGrid from "@/components/triangle/Grid.vue";
import { useBoard } from "@/use-board";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import * as tri from "@/lib/solver/triangle/tiles";
import * as sq from "@/lib/solver/square/tiles";
import * as hex from "@/lib/solver/hex/tiles";
import { None } from "@/lib/base/None";
import { useSettings } from "@/use-settings";
import { useLogs } from "@/use-logs";

const order: Record<BoardData["type"], TileConstructor[]> = {
  triangle: [None, tri.End, tri.Turn, tri.Triangle],
  square: [None, sq.End, sq.Line, sq.Turn, sq.Junction, sq.Cross],
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
};

export default defineComponent({
  name: "BoardArea",

  components: {
    Button,
    TriangleGrid,
  },

  setup() {
    const {
      board,
      highlighted,
      highlight,
      setTile,
      generateBoard,
      scrambleBoard,
    } = useBoard();
    const { settings } = useSettings();
    const { startGroup, log } = useLogs();

    function sleep(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const isRunning = ref(false);

    const grid = ref();

    async function solveBoard() {
      startGroup();
      const progress = solve(board);
      const tiles = new Map();

      grid.value.renderer.render();

      isRunning.value = true;

      while (isRunning.value) {
        const start = Date.now();

        tiles.clear();
        board.tiles.forEach((tile) => tiles.set(tile, tile.direction));

        const { done, value } = progress.next();

        if (done) {
          break;
        }

        value.tiles.forEach((tile) => {
          if (tile.direction !== tiles.get(tile)) {
            grid.value.renderer.animate(tile, tiles.get(tile));
          } else if (tile.solved) {
            grid.value.renderer.render([tile]);
          }
        });

        log(value);

        const delay = settings.delay - (Date.now() - start);
        await sleep(delay);
      }

      isRunning.value = false;
    }

    watchEffect(() => {
      grid.value?.renderer?.highlight([...highlighted]);
    });

    function highlightTile(tile: Tile | undefined): void {
      if (tile) {
        highlight([tile]);
      } else {
        highlight([]);
      }
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
      grid,
      board,
      generateBoard,
      scrambleBoard,
      solveBoard,
      nextTile,
      highlightTile,
      isRunning,
    };
  },
});
</script>
