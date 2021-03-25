<template>
  <svg viewBox="-52 -60 104 120">
        <path v-for="arc of arcs"
          :d="`M ${arc.start.x} ${arc.start.y} ${bezier(arc)}`"
          fill="transparent"
          stroke="#861e32"
          stroke-width="6"/>
  </svg>
</template>

<script lang="ts">
import { computed } from 'vue'
import {Tile, TileConstructor} from '../../../../src/solver/base/Tile'
import { Square, Star, Triangle, Diamond } from '../../../../src/solver/hex/tiles'

export default {
  name: 'Tile',

  props: {
    tile: Tile
  },

  setup (props: { tile: Tile }) {
    const RADIUS = 60

    const closed = new Set<TileConstructor>([Square, Triangle, Diamond, Star])

    const arcs = computed(() => {
      const arcs = []

      const sides = (props.tile.constructor as typeof Tile).SIDES

      let start = 0
      let end = 0

      while (end !== -1) {
        start = sides.indexOf(true, end)
        end = sides.indexOf(true, start + 1)

        if (end !== -1) {
          arcs.push(arcToPoints(start, end))
        }
      }

      if (closed.has(props.tile.constructor as TileConstructor)) {
        arcs.push(arcToPoints(start, 0))
      }

      return arcs
    })

    type Point = {side: number; x: number; y: number}
    type Arc = {start: Point; end: Point;}
    function directionToRad (direction: number): number {
      // to degrees
      direction *= 60
      // circles start right, but we start top
      direction -= 90

      return direction * Math.PI / 180
    }

    function arcToPoints (start: number, end: number): Arc {
      const startRad = directionToRad(start)
      const endRad = directionToRad(end)

      return {
        start: {
          side: start,
          x: Math.cos(startRad) * RADIUS,
          y: Math.sin(startRad) * RADIUS
        },
        end: {
          side: end,
          x: Math.cos(endRad) * RADIUS,
          y: Math.sin(endRad) * RADIUS
        }
      }
    }

    function bezier (arc: Arc): string {
      const start = arc.start.side
      const end = arc.end.side
      let sides = end - start

      if (sides < 0) {
        sides = 6 + sides
      }

      if (sides === 1) {
        const radius = RADIUS / 2

        const startRad = directionToRad(start)
        const startX = Math.cos(startRad) * radius
        const startY = Math.sin(startRad) * radius

        const endRad = directionToRad(end)
        const endX = Math.cos(endRad) * radius
        const endY = Math.sin(endRad) * radius

        return `C ${startX} ${startY}, ${endX} ${endY}, ${arc.end.x} ${arc.end.y}`
      }

      return `Q 0 0, ${arc.end.x} ${arc.end.y}`
    }

    return {
      arcs,
      bezier
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
