<template>
  <section :style="tilesStyle" class="tiles">
    <component :is="tile.type.toLowerCase()"
               v-for="tile of tiles"
               :key="tile"
               :style="getTileStyle(tile)"
               class="tile"/>
  </section>
</template>

<script lang="ts">
import { PropType, computed } from 'vue'
import { Tile } from '../../../../src/solver/base/Tile'
import End from '@/components/square/End.vue'
import Line from '@/components/square/Line.vue'
import None from '@/components/square/None.vue'
import Cross from '@/components/square/Cross.vue'
import Turn from '@/components/square/Turn.vue'

export default {
  name: 'Board',

  components: {
    End,
    Line,
    None,
    Cross,
    Turn
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

    function getTileStyle (tile: Tile): Record<string, string> {
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
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

.tile {
  transition: transform .2s ease-in-out;
}
</style>
