<template>
  <section :style="gridStyle" class="grid overflow-hidden">
    <Tile
      v-for="(tile, index) of tiles"
      :key="tile.type + index"
      :style="tileStyle(tile, index)"
      :tile="tile"
      class="tile transition hover:bg-dark/50"
      :class="{
        'bg-[radial-gradient(var(--tw-gradient-stops))] from-red/30 to-light':
          !tile.solved,
        'bg-dark/50': isHighlighted(tile),
      }"
      @click="$emit('change', index, tile, 1)"
      @contextmenu.prevent="$emit('change', index, tile, -1)"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
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

defineEmits(["change"]);

const gridStyle = computed(() => {
  return {
    "grid-template-columns": `repeat(20, 1fr)`,
    "grid-template-rows": `repeat(1, 1fr)`,
    // "aspect-ratio": `${props.x * 2}/${props.y}`,
  };
});

function tileStyle(tile: TileType, index: number) {
  // One tile is 2x3 grid spaces. Grids are 1-indexed.

  const col = {
    0: 1,
    1: 2,
    2: 3
  }[tile.x];

  return {
    // gridRow: `${tile.y * 2 + 1 + (tile.x % 2)}`,
    gridRow: 1,
    gridColumn: `${col} / span 2`,
    // transform: `rotate(${tile.direction * 60}deg)`,
    transform: `rotate(${index % 2 ? 180 : 0}deg)`
  };
}

const { isHighlighted } = useBoard();
</script>

<style scoped>
.tile {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  will-change: transform, background-color;
  background: red;
}
</style>