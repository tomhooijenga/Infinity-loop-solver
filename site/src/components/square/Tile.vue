<template>
  <svg viewBox="-50 -50 100 100">
    <template v-if="tile.type === 'None'">
      <circle r="2" class="none"/>
    </template>

    <template v-else-if="tile.type === 'End'">
      <circle r="25" class="line" />
      <path d="M 0 -25 L 0 -50" class="line" />
    </template>

    <template v-else-if="tile.type === 'Line'">
      <path d="M 0 -50 L 0 50" class="line" />
    </template>

    <template v-else
              v-for="arc of arcs"
              :key="arc">
        <circle r="50"
                :cx="corners[arc.start].x"
                :cy="corners[arc.start].y"
                class="line-background" />
        <circle r="50"
                :cx="corners[arc.start].x"
                :cy="corners[arc.start].y"
                class="line" />
    </template>
  </svg>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Tile, TileConstructor } from '../../../../src/solver/base/Tile'
import { Cross } from '../../../../src/solver/square/tiles'

type Point = {x: number; y: number}

const closed = new Set<TileConstructor>([Cross])
const RADIUS = 70.71

function rad (degree: number): number {
  return degree * Math.PI / 180
}

function point (rad: number): Point {
  return {
    x: Math.cos(rad) * RADIUS,
    y: Math.sin(rad) * RADIUS
  }
}

const corners = [315, 45, 135, 225].map((degree) => point(rad(degree)))

export default {
  name: 'Tile',

  props: {
    tile: Tile
  },

  setup (props: { tile: Tile }) {
    const arcs = computed(() => {
      const arcs = []

      const sides = (props.tile.constructor as typeof Tile).SIDES

      let start = 0
      let end = 0

      while (end !== -1) {
        start = sides.indexOf(true, end)
        end = sides.indexOf(true, start + 1)

        if (end !== -1) {
          arcs.push({ start, end })
        }
      }

      if (closed.has(props.tile.constructor as TileConstructor)) {
        arcs.push({ start, end: 0 })
      }

      return arcs
    })

    return {
      arcs,
      corners
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/theme";

svg {
  height: 100%;
  width: 100%;
}

.none {
  fill: $line-bg;
}

.line-background {
  fill: none;
  stroke: $line-shadow;
  stroke-width: 10;
}

.line {
  fill: none;
  stroke: $line-bg;
  stroke-width: 6;
}
</style>
