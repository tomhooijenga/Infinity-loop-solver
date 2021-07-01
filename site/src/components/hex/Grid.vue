<template>
  <section :style="tilesStyle" class="tiles">
    <div v-for="(tile, index) of tiles"
         :key="tile.type + index"
         :class="{unsolved: !tile.solved}"
         :style="tileStyle(tile)"
         class="tile">
      <Tile :tile="tile"
            @click="$emit('change', index, tile, 1)"
            @contextmenu.prevent="$emit('change', index, tile, -1)"/>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { Tile } from '../../../../src/base/Tile'
import TileComponent from './Tile.vue'

type Props = {
  tiles: Tile[];
  x: number;
  y: number;
}

export default {
  name: 'Grid',

  components: {
    Tile: TileComponent
  },

  props: {
    tiles: Array as PropType<Tile[]>,
    x: Number,
    y: Number
  },

  setup (props: Props) {
    const tilesStyle = computed(() => {
      const width = 1.1547
      const height = 1

      // Horizontally, each tile shares a "wing"
      const x = props.x * 0.75 * width + 0.25 * width

      let y = props.y * height

      // Add half a tile if an odd columns have an even count
      if (props.tiles.length % props.x % 2 === 0) {
        y += 0.5 * height
      }

      return {
        gridTemplateColumns: `repeat(${props.x}, 1fr 2fr) 1fr`,
        aspectRatio: `${x}/${y}`
      }
    })

    function tileStyle (tile: Tile) {
      // One tile is 2x3 grid spaces. Grids are 1-indexed.
      return {
        gridRow: `${tile.y * 2 + 1 + tile.x % 2} / span 2`,
        gridColumn: `${tile.x * 2 + 1} / span 3`,
        transform: `rotate(${tile.direction * 60}deg)`
      }
    }

    return {
      tilesStyle,
      tileStyle
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/theme";

.tiles {
  display: grid;
  overflow: hidden;
}

.tile {
  position: relative;
  transition: transform .2s ease-in-out, background-color .2s ease-in-out;
  //aspect-ratio: 1.1547 / 1;
  height: 0;
  padding-bottom: 86.60%;
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
  will-change: transform, background-color;

  &.unsolved {
    background: $tile-unsolved-bg;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  > * {
    position: absolute;
    height: 100%;
    width: 100%;
  }
}
</style>
