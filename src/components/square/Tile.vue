<template>
  <svg viewBox="-50 -50 100 100" class="w-full h-full">
    <template v-if="tile.type === 'None'">
      <circle r="2" class="fill-red" />
    </template>

    <template v-else-if="tile.type === 'End'">
      <circle r="25" class="fill-transparent stroke-red stroke-[6px]" />
      <path
        d="M 0 -25 L 0 -50"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-else-if="tile.type === 'Line'">
      <path
        d="M 0 -50 L 0 50"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-for="arc of arcs" v-else :key="arc">
      <circle
        r="50"
        :cx="corners[arc.start].x"
        :cy="corners[arc.start].y"
        class="fill-transparent stroke-light stroke-[10px]"
      />
      <circle
        r="50"
        :cx="corners[arc.start].x"
        :cy="corners[arc.start].y"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { Cross } from "@/lib/solver/square/tiles";
import { FacingState } from "@/lib/base/FacingState";

type Point = { x: number; y: number };

const closed = new Set<TileConstructor>([Cross]);
const RADIUS = 70.71;

function rad(degree: number): number {
  return (degree * Math.PI) / 180;
}

function point(rad: number): Point {
  return {
    x: Math.cos(rad) * RADIUS,
    y: Math.sin(rad) * RADIUS,
  };
}

const corners = [315, 45, 135, 225].map((degree) => point(rad(degree)));

export default defineComponent({
  name: "Tile",

  props: {
    tile: {
      type: Tile,
      required: true,
    },
  },

  setup(props: { tile: Tile }) {
    const arcs = computed(() => {
      const arcs = [];

      const sides = (props.tile.constructor as typeof Tile).SIDES;

      let start = 0;
      let end = 0;

      while (end !== -1) {
        start = sides.indexOf(FacingState.Open, end);
        end = sides.indexOf(FacingState.Open, start + 1);

        if (end !== -1) {
          arcs.push({ start, end });
        }
      }

      if (closed.has(props.tile.constructor as TileConstructor)) {
        arcs.push({ start, end: 0 });
      }

      return arcs;
    });

    return {
      arcs,
      corners,
    };
  },
});
</script>
