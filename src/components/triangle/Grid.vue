<template>
  <div ref="wrapper" class="w-full h-full min-w-0 flex">
    <canvas ref="canvas" class="m-auto ring" />
  </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, onMounted, PropType, ref, watch, watchEffect } from "vue";
import { Tile as TileType } from "@/lib/base/Tile";
import { resize } from "@/canvas/resize";
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
  });

  observer.observe(wrapper.value);
});

watch(board, () => {
  if (!ctx || !wrapper.value) {
    return;
  }

  const { width, height } = wrapper.value.getBoundingClientRect()
  resize(board, ctx, width, height);
})
//
// onMounted(() => {
//   const c = canvas.value!;
//   const ctx = c.getContext("2d")!;
//
//   const x = (props.x + 1) / 2;
//   const y = props.y * 0.8660254037844386;
//
//   const { width, height } = c.getBoundingClientRect();
//
//   console.log(c.getBoundingClientRect());
//
//   c.width = height * (x / y);
//   c.height = height;
// });
//
// watchEffect(() => {
//   const c = canvas.value;
//   if (!c) return;
//
//   const ctx = c.getContext("2d")!;
//   ctx.clearRect(0, 0, c.width, c.height);
//   const w = c.width / props.x;
//   props.tiles.forEach(({ x, y }) => triangle(ctx, w, x, y));
// });

function triangle(ctx: CanvasRenderingContext2D, w, x, y) {
  const h = w * 0.8660254037844386;
  const dx = w * x;
  const dy = h * y;

  ctx.beginPath();

  ctx.moveTo(dx + w / 2, dy);
  ctx.lineTo(dx + w, dy + h);
  ctx.lineTo(dx, dy + h);
  ctx.fill();
}
</script>
