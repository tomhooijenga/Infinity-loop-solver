<template>
  <svg viewBox="-60 -52 120 104" :type="tile.type">
    <template v-if="tile.type === 'None'">
      <circle r="2"
              fill="#861e32" />
    </template>

    <template v-else-if="tile.type === 'End'">
      <circle r="15"
              fill="none"
              stroke="#1d314b"
              stroke-width="10"/>
      <rect fill="#1d314b" height="40" width="10" x="-5" y="-50%" />
      <circle r="15"
              fill="none"
              stroke="#861e32"
              stroke-width="6"/>
      <rect fill="#861e32" height="40" width="6" x="-3" y="-50%" />
    </template>

    <template v-else
              v-for="arc of arcs"
              :key="arc">
      <template v-if="arc.end - arc.start === 1 || (arc.start === 5 && arc.end === 0)">
        <circle r="30.02"
                :cx="corners[arc.start].x"
                :cy="corners[arc.start].y"
                fill="none"
                stroke="#1d314b"
                stroke-width="10"/>
        <circle r="30.02"
                :cx="corners[arc.start].x"
                :cy="corners[arc.start].y"
                fill="none"
                stroke="#861e32"
                stroke-width="6"/>
      </template>
      <template v-else>
        <path :d="path(arc)"
              fill="none"
              stroke="#1d314b"
              stroke-width="10"/>
        <path :d="path(arc)"
              fill="none"
              stroke="#861e32"
              stroke-width="6"/>
      </template>
    </template>
  </svg>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Tile, TileConstructor } from '../../../../src/solver/base/Tile'
import { Square, Star, Triangle, Diamond } from '../../../../src/solver/hex/tiles'

type Arc = {start: number; end: number;}
type Point = {x: number; y: number}

const closed = new Set<TileConstructor>([Square, Triangle, Diamond, Star])
const RADIUS = 60

function rad (degree: number): number {
  return degree * Math.PI / 180
}

function point (rad: number): Point {
  return {
    x: Math.cos(rad) * RADIUS,
    y: Math.sin(rad) * RADIUS
  }
}

const corners = [300, 0, 60, 120, 180, 240, 300].map((degree) => {
  return point(rad(degree))
})

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

    function path (arc: Arc): string {
      const start = point(rad(arc.start * 60 - 90))
      const end = point(rad(arc.end * 60 - 90))
      return `M ${start.x} ${start.y}, Q 0 0, ${end.x} ${end.y}`
    }

    return {
      arcs,
      corners,
      path
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