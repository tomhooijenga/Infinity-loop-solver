<template>
  <div ref="wrapper" class="w-full h-full min-w-0 flex overflow-hidden">
    <canvas ref="canvas" class="m-auto" />
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowRef, watchEffect } from "vue";
import { factory, type GridRenderer } from "@/renderer";
import { BoardData } from "@/boards";
import { Tile } from "@/lib/base/Tile";

const props = defineProps({
  type: {
    type: String as PropType<BoardData["type"]>,
    required: true,
  },
  tiles: {
    type: Array as PropType<Tile[]>,
    required: true,
  },
});

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

  const ctx = canvas.value?.getContext("2d");

  if (!ctx) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { width, height } = canvas.value.parentElement!.getBoundingClientRect();
  const r = factory(props.type, props.tiles, ctx);
  r.resize(width, height);
  r.render();
  renderer.value = r;
});
</script>
