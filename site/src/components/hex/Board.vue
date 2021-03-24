<template>
  <section>
    <Tile v-for="tile of tiles"
          :key="tile"
          :tile="tile"
          style="width: 115.5px; height: 100px; background: gray; clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);"
    />
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { Tile } from '../../../../src/solver/base/Tile'
import TileComponent from './Tile.vue'

export default {
  name: 'Board',

  components: {
    Tile: TileComponent
  },

  props: {
    tiles: Array as PropType<Tile[]>,
    x: Number,
    y: Number
  }
}
</script>

<style scoped lang="scss">

</style>
