<template>
    <div class="w-64 shrink-0 overflow-y-auto">
    <h1 class="m-6">Progress</h1>

    <div
      v-for="(group, i) of logs"
      :key="i"
      class="border-b border-b-light m-4 pb-4" :class="{'opacity-50': i !== 0}"
    >
      <log-group :group="group" :is-last="i === 0"  />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogs } from "@/use-logs";
import { computed } from "vue";
import LogGroup from "@/components/LogGroup.vue";

const { logs: rawLogs } = useLogs();
const logs = computed(() =>
  rawLogs
    .slice()
    .reverse()
    .filter((group) => group.length)
);
</script>
