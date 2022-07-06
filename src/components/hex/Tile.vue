<template>
  <svg viewBox="-60 -52 120 104">
    <template v-if="tile.type === 'None'">
      <circle r="2" class="fill-red" />
    </template>

    <template v-else-if="tile.type === 'End'">
      <circle r="15" class="fill-transparent stroke-red stroke-[6px]" />
      <path
        d="M 0 -15 L 0 -52"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-else-if="tile.type === 'Star'">
      <circle
        v-for="i of 3"
        :key="i"
        :cx="corners[arcs[(i - 1) * 2].start].x"
        :cy="corners[arcs[(i - 1) * 2].start].y"
        r="30.02"
        class="fill-transparent stroke-red stroke-[6px]"
      />
    </template>

    <template v-for="arc of arcs" v-else :key="arc">
      <template
        v-if="arc.end - arc.start === 1 || (arc.start === 5 && arc.end === 0)"
      >
        <circle
          :cx="corners[arc.start].x"
          :cy="corners[arc.start].y"
          r="30.02"
          class="fill-transparent stroke-light stroke-[10px]"
        />
        <circle
          :cx="corners[arc.start].x"
          :cy="corners[arc.start].y"
          r="30.02"
          class="fill-transparent stroke-red stroke-[6px]"
        />
      </template>
      <template v-else>
        <path
          :d="path(arc)"
          class="fill-transparent stroke-light stroke-[10px]"
        />
        <path :d="path(arc)" class="fill-transparent stroke-red stroke-[6px]" />
      </template>
    </template>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { Diamond, Square, Star, Triangle } from "@/lib/solver/hex/tiles";
import { FacingState } from "@/lib/base/FacingState";

type Arc = { start: number; end: number };
type Point = { x: number; y: number };

const closed = new Set<TileConstructor>([Square, Triangle, Diamond, Star]);
const RADIUS = 60;

function rad(degree: number): number {
  return (degree * Math.PI) / 180;
}

function point(rad: number): Point {
  return {
    x: Math.cos(rad) * RADIUS,
    y: Math.sin(rad) * RADIUS,
  };
}

const corners = [300, 0, 60, 120, 180, 240, 300].map((degree) => {
  return point(rad(degree));
});

export default defineComponent({
  name: "Tile",

  props: {
    tile: {
      type: Tile,
      required: true,
    },
  },

  setup(props) {
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

    function path(arc: Arc): string {
      const start = point(rad(arc.start * 60 - 90));
      const end = point(rad(arc.end * 60 - 90));
      return `M ${start.x} ${start.y}, Q 0 0, ${end.x} ${end.y}`;
    }

    return {
      arcs,
      corners,
      path,
    };
  },
});
</script>
