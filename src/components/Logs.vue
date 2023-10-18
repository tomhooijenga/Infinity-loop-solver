<template>
  <transition
    appear
    enter-active-class="transition-opacity"
    leave-active-class="transition-opacity"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="flyout"
      class="lg:hidden fixed inset-0 z-10 bg-white/20"
      @click="flyout = false"
    ></div>
  </transition>

  <Button
    class="fixed right-4 top-4 lg:hidden"
    variant="dark"
    @click="flyout = true"
    >Progress</Button
  >

  <div
    class="fixed right-0 inset-y-0 z-10 shrink-0 lg:translate-x-0 transition bg-dark lg:relative w-min overflow-y-auto [scrollbar-gutter:stable]"
    :class="{ 'translate-x-full': !flyout, 'translate-x-0': flyout }"
  >
    <h1 class="m-6">Progress</h1>
    <template v-if="logs.length">
      <p class="m-6">Tap or hover an entry to show which tiles were solved.</p>
      <div
        v-for="(group, i) of logs"
        :key="i"
        class="border-b border-b-light m-4 pb-4"
        :class="{ 'opacity-50': i !== 0 }"
      >
        <log-group :group="group" :is-first="i === 0" />
      </div>
    </template>
    <p v-else class="m-6">
      Solver progress will appear here when you start a solve.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useLogs } from "@/use-logs";
import { computed, ref } from "vue";
import LogGroup from "@/components/LogGroup.vue";
import Button from "@/components/Button.vue";

const { logs: rawLogs } = useLogs();
const logs = computed(() =>
  rawLogs
    .slice()
    .reverse()
    .filter((group) => group.length)
);

const flyout = ref(false);
</script>
