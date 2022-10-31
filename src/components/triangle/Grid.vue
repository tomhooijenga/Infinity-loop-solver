<template>
  <div ref="wrapper" class="w-full h-full min-w-0 flex">
    <canvas ref="canvas" class="m-auto" />
  </div>
</template>

<script setup lang="ts">
import { computed, isReactive, PropType, ref, watch, watchEffect } from "vue";
import { Tile as TileType } from "@/lib/base/Tile";
import {
  hexRenderer,
  render,
  resize,
  squareRenderer,
  triangleRenderer,
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
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});

defineEmits<{
  (e: "change", index: number, tile: TileType, direction: -1 | 1): void;
}>();

const grids = {
  triangle: TriangleGrid,
  square: SquareGrid,
  hex: HexGrid,
};
const grid = computed(() => new grids[props.type](props.tiles));

const renderers = {
  triangle: triangleRenderer,
  square: squareRenderer,
  hex: hexRenderer,
};
const renderer = computed(() => renderers[props.type]);

const wrapper = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D;
let observer: ResizeObserver;
watchEffect((onCleanup) => {
  onCleanup(() => observer?.disconnect());

  if (!canvas.value || !wrapper.value) {
    return;
  }

  // eslint-disable-next-line
  ctx = canvas.value.getContext("2d")!;

  observer = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    resize(grid.value, renderer.value, ctx, width, height);
    render(grid.value, renderer.value, ctx);
  });

  observer.observe(wrapper.value);
});

watch(props, () => {
  if (!ctx || !wrapper.value) {
    return;
  }

  grid.value.setTiles(props.tiles);

  const { width, height } = wrapper.value.getBoundingClientRect();

  resize(grid.value, renderer.value, ctx, width, height);
  render(grid.value, renderer.value, ctx);
});

watch(
  () => props.tiles,
  () => render(grid.value, renderer.value, ctx),
  { deep: true }
);
</script>
