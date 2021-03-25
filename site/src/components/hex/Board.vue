<template>
  <section :style="tilesStyle" class="tiles">
    <template v-for="tile of tiles"
              :key="tile">
      <div :style="tileStyle(tile)"
           class="tile">
        <End v-if="tile.type === 'End'" />
        <None v-else-if="tile.type === 'None'" />
        <Tile v-else
              :tile="tile" />
      </div>
    </template>
  </section>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { Tile } from '../../../../src/solver/base/Tile'
import TileComponent from './Tile.vue'
import End from '@/components/hex/End.vue'
import None from '@/components/hex/None.vue'

type Props = {
  tiles: Tile[];
  x: number;
  y: number;
}

export default {
  name: 'Board',

  components: {
    None,
    End,
    Tile: TileComponent
  },

  props: {
    tiles: Array as PropType<Tile[]>,
    x: Number,
    y: Number
  },

  setup (props: Props) {
    const tilesStyle = computed(() => {
      return {
        gridTemplateColumns: `repeat(${props.x}, 1fr 2fr) 1fr`,
        aspectRatio: `${props.x * 1.1547}/${props.y}`
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

.tiles {
  display: grid;
}

.tile {
  position: relative;
  transition: transform .2s ease-out;
  height: 0;
  // aspect-ratio: 1.1547 / 1
  padding-bottom: 86.60%;
  //clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
  //background: gray;

  > * {
    position: absolute;
    height: 100%;
    width: 100%;
  }
}
</style>
