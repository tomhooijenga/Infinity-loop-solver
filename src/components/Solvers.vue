<template>
  <h1>Solvers</h1>
  <section class="bg-light p-4">
    <template v-for="group of typeDescriptions" :key="group.name">
      <h2>{{ group.name }}</h2>
      <p>{{ group.description }}</p>
      <label
        v-for="(label, name) of group.solvers"
        :key="name"
        class="flex items-center py-1"
      >
        <input v-model="solverSettings[name]" type="checkbox" class="mr-2" />
        {{ label }}
      </label>
    </template>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import descriptions from "@/descriptions";
import { useBoard } from "@/use-board";
import { useSettings } from "@/use-settings";

export default defineComponent({
  setup() {
    const { board } = useBoard();
    const typeDescriptions = computed(() => descriptions[board.type]);

    const { settings } = useSettings();
    const solverSettings = computed<Record<string, boolean>>(
      () => settings.solvers[board.type]
    );

    return {
      typeDescriptions,
      solverSettings,
      board,
    };
  },
});
</script>
