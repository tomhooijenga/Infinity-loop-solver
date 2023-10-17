<template>
  <div class="grid [grid-template-rows:1fr_auto] flex-1 bg-light min-h-0">
    <div class="w-full h-full min-w-0 flex overflow-hidden">
      <canvas
        ref="canvas"
        class="m-auto"
        @click="nextTile($event, 1)"
        @mousemove="highlightTile($event)"
        @mouseout="highlight([])"
        @contextmenu.prevent="nextTile($event, -1)"
      />
    </div>

    <section class="flex flex-wrap bg-dark p-2">
      <Button :disabled="isRunning" @click="generateBoard"> Generate</Button>
      <span class="mx-auto space-x-2">
        <Button :disabled="isRunning" @click="scrambleBoard"> Scramble </Button>
        <Button :disabled="isRunning" @click="solveBoard"> Solve </Button>
      </span>
      <Button :disabled="!isRunning" @click="isRunning = false"> Stop</Button>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, watchEffect } from "vue";
import { BoardData, solve } from "@/boards";
import Button from "@/components/Button.vue";
import { useBoard } from "@/use-board";
import { TileConstructor } from "@/lib/base/Tile";
import * as tri from "@/lib/solver/triangle/tiles";
import * as sq from "@/lib/solver/square/tiles";
import * as hex from "@/lib/solver/hex/tiles";
import { None } from "@/lib/base/None";
import { useSettings } from "@/use-settings";
import { useLogs } from "@/use-logs";
import { factory, type GridRenderer } from "@/renderer";

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

const { board, highlighted, highlight, setTile, generateBoard, scrambleBoard } =
  useBoard();
const { settings } = useSettings();
const { startGroup, log } = useLogs();

const canvas = shallowRef<HTMLCanvasElement>();
const renderer = shallowRef<GridRenderer>();

const observer = new ResizeObserver((entries) => {
  const { width, height } = entries[0].contentRect;

  if (!renderer.value) {
    return;
  }

  renderer.value?.resize(width, height);
  renderer.value?.render();
});

watchEffect((onCleanup) => {
  onCleanup(() => observer?.disconnect());

  if (!canvas.value) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const wrapper = canvas.value.parentElement!;

  observer.observe(wrapper);
});

watchEffect(() => {
  if (!canvas.value) {
    return;
  }

  const ctx = canvas.value.getContext("2d");

  if (!ctx) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { width, height } = canvas.value.parentElement!.getBoundingClientRect();
  const r = factory(board.type, board.tiles, ctx);
  r.resize(width, height);
  r.render();
  renderer.value = r;

  // un-highlight because it might have old tiles
  highlight([]);
});

const isRunning = ref(false);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
}

async function solveBoard() {
  startGroup();
  const progress = solve(board);

  renderer.value?.render();

  isRunning.value = true;

  let frameStart = performance.now();
  while (isRunning.value) {
    const start = performance.now();

    const { done, value } = progress.next();

    if (done) {
      break;
    }

    value.tiles.forEach((tile) => {
      renderer.value?.animate(tile);
    });

    log(value);

    const delay = settings.delay - (performance.now() - start);
    const frameElapsed = performance.now() - frameStart;

    if (delay > 0 || frameElapsed > 1000 / 60) {
      await sleep(delay);
      frameStart = performance.now();
    }
  }

  isRunning.value = false;
}

watchEffect(() => {
  try {
    renderer.value?.highlight([...highlighted]);
  } catch (e) {
    // Tiles might not belong to current grid
  }
});

function highlightTile(event: MouseEvent): void {
  const tile = renderer.value?.getTileFromPoint(event.offsetX, event.offsetY);

  if (tile) {
    highlight([tile]);
  }
}

function nextTile(event: MouseEvent, direction: -1 | 1): void {
  const tile = renderer.value?.getTileFromPoint(event.offsetX, event.offsetY);

  if (!tile) {
    return;
  }

  const tileIndex = renderer.value?.grid.tiles.indexOf(tile) ?? 0;
  const typeOrder = order[board.type];
  let typeIndex =
    (typeOrder.indexOf(tile.constructor as TileConstructor) + direction) %
    typeOrder.length;
  if (typeIndex < 0) {
    typeIndex += typeOrder.length;
  }
  const TileType = typeOrder[typeIndex];

  setTile(
    tileIndex,
    new TileType({
      solved: true,
      x: tile.x,
      y: tile.y,
    })
  );
}
</script>
