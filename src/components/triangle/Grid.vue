<template>
  <section :style="gridStyle" class="grid overflow-hidden">
    <Tile
      v-for="(tile, index) of tiles"
      :key="tile.type + index"
      :style="tileStyle(tile)"
      :tile="tile"
      class="transition-transform hover:bg-dark/50 w-full h-full clip-triangle"
      :class="{
        'bg-gradient-radial from-red/30 to-light': !tile.solved,
        'bg-dark/50': isHighlighted(tile),
      }"
      @click="$emit('change', index, tile, 1)"
      @contextmenu.prevent="$emit('change', index, tile, -1)"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, CSSProperties, PropType } from "vue";
import { Tile as TileType } from "@/lib/base/Tile";
import Tile from "@/components/triangle/Tile.vue";
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
    "grid-template-columns": `repeat(${props.x + 1}, 1fr)`,
    "grid-template-rows": `repeat(${props.y}, 1fr)`,
    "aspect-ratio": `${x}/${y}`,
  };
});

function pointyUp(tile: TileType): boolean {
  // (0,0) points up.
  const { x, y } = tile;

  if (y % 2 === 0) {
    return x % 2 === 0;
  }

  return x % 2 === 1;
}

function tileStyle(tile: TileType): CSSProperties {
  let rotate = tile.direction * 120;

  if (!pointyUp(tile)) {
    // 180 to flip it, 120 to make down actually down again.
    rotate += 300;
  }

  return {
    gridRow: `${tile.y + 1} / span 1`,
    gridColumn: `${tile.x + 1} / span 2`,
    transform: `rotate(${rotate}deg)`,
    transformOrigin: "50% 66.66666%",
    position: "relative",
    top: pointyUp(tile) ? 0 : "-33%",
  };
}

const { isHighlighted } = useBoard();
</script>
