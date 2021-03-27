<template>
  <section :style="tilesStyle" class="tiles">
    <Tile v-for="tile of tiles"
          :style="getTileStyle(tile)"
          :tile="tile"
          class="tile" />
  </section>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { Tile } from '../../../../src/solver/base/Tile'
import TileComponent from '@/components/square/Tile.vue'

export default {
  name: 'Board',

  components: {
    Tile: TileComponent
  },

  props: {
    tiles: Array as PropType<Tile[]>,
    x: Number,
    y: Number
  },

  setup (props: { tiles: Tile[], x: number, y: number }) {
    const tilesStyle = computed(() => {
      return {
        'grid-template-columns': `repeat(${props.x}, 1fr)`,
        'grid-template-rows': `repeat(${props.y}, 1fr)`,
        'aspect-ratio': `${props.x}/${props.y}`
      }
    })

    function getTileStyle (tile: Tile) {
      return {
        transform: `rotate(${tile.direction * 90}deg)`
      }
    }

    return {
      tilesStyle,
      getTileStyle
    }
  }
}
</script>

<style scoped>
.tiles {
  display: grid;
  overflow: hidden;
}

.tile {
  transition: transform .2s ease-in-out;
}
</style>
