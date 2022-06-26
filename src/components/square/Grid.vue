<template>
  <section :style="gridStyle" class="grid overflow-hidden">
    <Tile
      v-for="(tile, index) of tiles"
      :key="tile.type + index"
      :style="`transform: rotate(${tile.direction * 90}deg)`"
      :tile="tile"
      class="transition hover:bg-dark/50"
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

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { Tile } from "@/lib/base/Tile";
import TileComponent from "@/components/square/Tile.vue";
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
      return {
        "grid-template-columns": `repeat(${props.x}, 1fr)`,
        "grid-template-rows": `repeat(${props.y}, 1fr)`,
        "aspect-ratio": `${props.x}/${props.y}`,
      };
    });

    const { isHighlighted } = useBoard();

    return {
      gridStyle,
      isHighlighted,
    };
  },
});
</script>
