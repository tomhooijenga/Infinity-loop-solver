<template>
  <div ref="wrapper" class="w-full h-full min-w-0 flex">
    <canvas ref="canvas" class="m-auto ring" />
  </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, onMounted, PropType, ref, watch, watchEffect } from "vue";
import { Tile as TileType } from "@/lib/base/Tile";
import { render, resize } from "@/canvas/resize";
import { useBoard } from "@/use-board";

const props = defineProps({
  tiles: {
    type: Array as PropType<TileType[]>,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

defineEmits<{
  (e: "change", index: number, tile: TileType, direction: -1 | 1): void;
}>();

const gridStyle = computed((): CSSProperties => {
  const x = (props.x + 1) / 2;
  const y = props.y * 0.8660254037844386;

  return {
    "aspect-ratio": `${x}/${y}`,
  };
});

const wrapper = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D;
const { board } = useBoard();

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
    resize(board, ctx, width, height);
    render(board, ctx);
  });

  observer.observe(wrapper.value);
});

watch([() => board.width, () => board.height], () => {
  if (!ctx || !wrapper.value) {
    return;
  }

  const { width, height } = wrapper.value.getBoundingClientRect()
  resize(board, ctx, width, height);
});

watch(() => board.tiles, () => {
  render(board, ctx);
})
</script>
