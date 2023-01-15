<template>
  <div ref="wrapper" class="w-full h-full min-w-0 flex">
    <canvas
      ref="canvas"
      class="m-auto"
      @click="change($event, 1)"
      @contextmenu.prevent="change($event, -1)"
      @mousemove="highlightTile($event)"
      @mouseout="$emit('hover', undefined)"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, shallowRef, toRaw, watchEffect } from "vue";
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

const emit = defineEmits<{
  (e: "change", index: number, tile: TileType, direction: -1 | 1): void;
  (e: "hover", tile: TileType | undefined): void;
}>();

const renderer = shallowRef<GridRenderer>();

defineExpose({
  renderer,
});

const renderers: Record<
  BoardData["type"],
  (tiles: TileType[], ctx: CanvasRenderingContext2D) => GridRenderer
> = {
  triangle: (tiles, ctx) =>
    new TriangleGridRenderer(new TriangleGrid(tiles), ctx),
  square: (tiles, ctx) => new SquareGridRenderer(new SquareGrid(tiles), ctx),
  hex: (tiles, ctx) => new HexGridRenderer(new HexGrid(tiles), ctx),
};

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
  renderer.value = renderers[props.type](toRaw(props.tiles), ctx);

  observer = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;

    renderer.value?.resize(width, height);
    renderer.value?.render();
  });

  observer.observe(wrapper.value);

  const { width, height } = wrapper.value.getBoundingClientRect();

  renderer.value.resize(width, height);
});

function change(event: MouseEvent, direction: 1 | -1): void {
  if (!renderer.value) {
    return;
  }

  const tile = renderer.value?.getTileFromPoint(event.offsetX, event.offsetY);

  if (tile) {
    const index = renderer.value?.grid.tiles.indexOf(tile);
    emit("change", index, tile, direction);
  }
}

function highlightTile(event: MouseEvent): void {
  if (!renderer.value) {
    return;
  }

  const tile = renderer.value?.getTileFromPoint(event.offsetX, event.offsetY);

  emit("hover", tile);
}
</script>
