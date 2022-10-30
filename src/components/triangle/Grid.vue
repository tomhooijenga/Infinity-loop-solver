<template>
  <div ref="wrapper" class="w-full h-full min-w-0 flex">
    <canvas ref="canvas" class="m-auto ring" />
  </div>
</template>

<script setup lang="ts">
import {
  PropType,
  ref,
  watch,
  watchEffect,
} from "vue";
import { Tile as TileType } from "@/lib/base/Tile";
import { render, resize } from "@/canvas/resize";
import { BoardData } from "@/boards";

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
    resize(props, ctx, width, height);
    render(props, ctx);
  });

  observer.observe(wrapper.value);
});

watch([() => props.type, () => props.width, () => props.height], () => {
  if (!ctx || !wrapper.value) {
    return;
  }

  const { width, height } = wrapper.value.getBoundingClientRect();
  resize(props, ctx, width, height);
  render(props, ctx);
});

watch(
  () => props.tiles,
  () => {
    render(props, ctx);
  }
);
</script>
