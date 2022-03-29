<template>
  <h1>Solvers</h1>
  <section>
    <template v-for="group of solvers" :key="group.title">
      <h2>{{ group.name }}</h2>
      <p>{{ group.description }}</p>
      <label v-for="(label, name) of group.solvers" :key="name">
        <input type="checkbox" v-model="settings.solvers[board.type][name]" />
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
    const solvers = computed(() => descriptions[board.type]);
    const { settings } = useSettings();

    return {
      solvers,
      settings,
      board,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/theme";

section {
  background: $color-default;
  padding: 1rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 0;

  &:not(:first-child) {
    margin-top: 2rem;
  }
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}

label {
  display: flex;
}
</style>
