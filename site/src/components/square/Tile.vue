<template>
  <svg viewBox="-50 -50 100 100">
    <template v-if="tile.type === 'None'">
      <circle r="2"
              fill="#861e32" />
    </template>

    <template v-else-if="tile.type === 'End'">
      <circle r="25"
              fill="none"
              stroke="#1d314b"
              stroke-width="10"/>
      <rect fill="#1d314b" height="25" width="10" x="-5" y="-50%" />
      <circle r="25"
              fill="none"
              stroke="#861e32"
              stroke-width="6"/>
      <rect fill="#861e32" height="25" width="6" x="-3" y="-50%" />
    </template>

    <template v-else-if="tile.type === 'Line'">
      <rect fill="#1d314b" height="100%" width="10" x="-5" y="-50%" />
      <rect fill="#861e32" height="100%" width="6" x="-3" y="-50%" />
    </template>

    <template v-else
              v-for="arc of arcs"
              :key="arc">
        <circle r="50"
                :cx="corners[arc.start].x"
                :cy="corners[arc.start].y"
                fill="none"
                stroke="#1d314b"
                stroke-width="10"/>
        <circle r="50"
                :cx="corners[arc.start].x"
                :cy="corners[arc.start].y"
                fill="none"
                stroke="#861e32"
                stroke-width="6"/>
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

<style scoped>
svg {
  height: 100%;
  width: 100%;
}
</style>
