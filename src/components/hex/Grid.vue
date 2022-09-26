<template>
  <section :style="gridStyle" class="grid overflow-hidden">
    <Tile
      v-for="(tile, index) of tiles"
      :key="tile.type + index"
      :tile="tile"
      :style="tileStyle(tile)"
      class="transition-transform hover:bg-dark/50 w-full h-full clip-hexagon"
      :class="{
        'bg-gradient-radial from-red/30 to-light': !tile.solved,
        'bg-dark/50': isHighlighted(tile),
      }"
      @click="$emit('change', index, tile, 1)"
      @contextmenu.prevent="$emit('change', index, tile, -1)"
    />
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Tile } from "@/lib/base/Tile";
import TileComponent from "./Tile.vue";
import { useBoard } from "@/use-board";

export default defineComponent({
  name: "Grid",

  components: {
    Tile: TileComponent,
  },

  props: {
    tiles: {
      type: Array as PropType<Tile[]>,
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
  },

  emits: ["change"],

  setup(props) {
    const gridStyle = computed(() => {
      const width = 1.1547;
      const height = 1;

      // Horizontally, each tile shares a "wing"
      const x = props.x * 0.75 * width + 0.25 * width;

      let y = props.y * height;

      // Add half a tile if an odd columns have an even count
      if ((props.tiles.length % props.x) % 2 === 0) {
        y += 0.5 * height;
      }

      return {
        "grid-template-columns": `repeat(${props.x}, 1fr 2fr) 1fr`,
        "grid-template-rows": `repeat(${props.y}, 1fr)`,
        "aspect-ratio": `${x}/${y}`,
      };
    });

    function tileStyle(tile: Tile) {
      // One tile is 2x3 grid spaces. Grids are 1-indexed.
      return {
        gridRow: `${tile.y * 2 + 1 + (tile.x % 2)} / span 2`,
        gridColumn: `${tile.x * 2 + 1} / span 3`,
        transform: `rotate(${tile.direction * 60}deg)`,
      };
    }

    const { isHighlighted } = useBoard();

    return {
      gridStyle,
      tileStyle,
      isHighlighted,
    };
  },
});
</script>
