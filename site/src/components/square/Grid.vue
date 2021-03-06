<template>
  <section :style="tilesStyle" class="tiles">
    <Tile v-for="(tile, index) of tiles"
          :key="tile.type + index"
          :style="`transform: rotate(${tile.direction * 90}deg)`"
          :tile="tile"
          class="tile"
          :class="{unsolved: !tile.solved}"
          @click="$emit('change', index, tile, 1)"
          @contextmenu.prevent="$emit('change', index, tile, -1)"/>
  </section>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { Tile } from '../../../../src/base/Tile'
import TileComponent from '@/components/square/Tile.vue'

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

  setup (props: { tiles: Tile[], x: number, y: number }) {
    const tilesStyle = computed(() => {
      return {
        'grid-template-columns': `repeat(${props.x}, 1fr)`,
        'grid-template-rows': `repeat(${props.y}, 1fr)`,
        'aspect-ratio': `${props.x}/${props.y}`
      }
    })

    return {
      tilesStyle
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
  transition: transform .2s ease-in-out, background-color .2s ease-in-out;
  will-change: transform, background-color;

  &.unsolved {
    background: $tile-unsolved-bg;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
