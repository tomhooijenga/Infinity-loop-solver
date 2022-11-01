<template>
  <div ref="wrapper" class="w-full h-full min-w-0 flex">
    <canvas ref="canvas" class="m-auto" />
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, toRaw, watch, watchEffect } from "vue";
import { Tile as TileType } from "@/lib/base/Tile";
import {
  GridRenderer,
  HexGridRenderer,
  SquareGridRenderer,
  TriangleGridRenderer,
} from "@/canvas";

import { BoardData } from "@/boards";
import { Grid as TriangleGrid } from "@/lib/solver/triangle/Grid";
import { Grid as SquareGrid } from "@/lib/solver/square/Grid";
import { Grid as HexGrid } from "@/lib/solver/hex/Grid";
const props = defineProps({
  type: {
    type: String as PropType<BoardData["type"]>,
    required: true,
  },
  tiles: {
    type: Array as PropType<TileType[]>,
    required: true,
  },
});

defineEmits<{
  (e: "change", index: number, tile: TileType, direction: -1 | 1): void;
}>();

const renderers = {
  triangle: (ctx: CanvasRenderingContext2D) =>
    new TriangleGridRenderer(new TriangleGrid(toRaw(props.tiles)), ctx),
  square: (ctx: CanvasRenderingContext2D) =>
    new SquareGridRenderer(new SquareGrid(toRaw(props.tiles)), ctx),
  hex: (ctx: CanvasRenderingContext2D) =>
    new HexGridRenderer(new HexGrid(toRaw(props.tiles)), ctx),
};

const wrapper = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D;
let observer: ResizeObserver;
let renderer: GridRenderer;

watchEffect((onCleanup) => {
  onCleanup(() => observer?.disconnect());

  if (!canvas.value || !wrapper.value) {
    return;
  }

  // eslint-disable-next-line
  ctx = canvas.value.getContext("2d")!;
  renderer = renderers[props.type](ctx);

  observer = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;

    renderer.resize(width, height);
    renderer.render();
  });

  observer.observe(wrapper.value);

  const { width, height } = wrapper.value.getBoundingClientRect();

  renderer.resize(width, height);
});

watch(
  () => props.tiles,
  () => renderer.grid.setTiles(toRaw(props.tiles))
);

watch(
  () => props.tiles,
  () => renderer.render(),
  { deep: true }
);
</script>
