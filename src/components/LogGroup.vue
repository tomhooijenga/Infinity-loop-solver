<template>
  <small class="p-2 block text-neutral/70"> Solved {{ solved }} tiles </small>
  <div
    v-for="(log, i) of condensed"
    :key="i"
    class="p-2"
    :class="{
      'hover:bg-light': isFirst,
    }"
    @mouseenter="isFirst && highlight(log.tiles)"
    @mouseleave="highlight([])"
  >
    {{ log.solver }}<br />
    <small class="text-neutral/70"> Solved {{ log.tiles.length }} </small>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import { SolveProgress } from "@/lib/solver/base/SolveProgress";
import { useBoard } from "@/use-board";

const props = defineProps({
  group: {
    type: Array as PropType<SolveProgress[]>,
    default: () => [],
  },
  isFirst: {
    type: Boolean,
    default: false,
  },
});

const solved = computed(() =>
  props.group.reduce((sum, { tiles }) => sum + tiles.length, 0),
);

const condensed = computed(() => {
  let lastEntry = props.group[0];
  const condensed = [
    {
      start: 0,
      end: 0,
      solver: lastEntry.solver,
      tiles: [...lastEntry.tiles],
    },
  ];

  for (let i = 1; i < props.group.length; i++) {
    const entry = props.group[i];

    if (entry.solver === lastEntry.solver) {
      condensed[condensed.length - 1].end = i;
      condensed[condensed.length - 1].tiles.push(...entry.tiles);
    } else {
      lastEntry = entry;

      condensed.push({
        start: i,
        end: i,
        solver: entry.solver,
        tiles: [...entry.tiles],
      });
    }
  }

  return condensed.reverse();
});

const { highlight } = useBoard();
</script>
