<template>
  <div class="w-64 shrink-0 overflow-y-auto">
    <div
      v-for="(group, i) of logs"
      :key="i"
      class="border-b border-b-light m-4 pb-4 grid [grid-template-columns:auto_1fr]"
    >
      <template v-for="(log, i2) of group.slice().reverse()" :key="i2">
        <div class="text-right text-neutral/70 p-2">{{ group.length - i2 }}</div>
        <div class="hover:bg-light p-2" @mouseenter="highlight(log.tiles)" @mouseleave="highlight([])">
          {{ log.solver }}<br />
          <small class="text-neutral/70">Solved {{ log.tiles.length }}</small>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogs } from "@/use-logs";
import { computed } from "vue";
import { useBoard } from "@/use-board";

const { logs: rawLogs } = useLogs();
const logs = computed(() => rawLogs.slice().reverse().filter((group) => group.length));

const { highlight } = useBoard();
</script>
