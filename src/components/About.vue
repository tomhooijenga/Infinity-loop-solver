<template>
  <h1>What am I looking at?</h1>
  <p>
    This is a solver and generator for the
    <a href="http://loopgame.co/" target="_blank">&infin; Loop</a> game.
  </p>

  <h1>What can I do?</h1>
  <p>
    Tap on a tile to change its type. Create and solve your own board, or check
    it out with one of the examples!
  </p>
  <dl class="mb-4 grid [grid-template-columns:auto_1fr] gap-x-4">
    <dt class="text-right font-bold">Examples</dt>
    <dd>Predefined boards to try out.</dd>
    <dt class="text-right font-bold">Settings</dt>
    <dd>Control the parameters of the board.</dd>
  </dl>
  <dl class="mb-4 grid [grid-template-columns:auto_1fr] gap-x-4">
    <dt class="text-right font-bold">Generate</dt>
    <dd>Fill your board with a random pattern.</dd>
    <dt class="text-right font-bold">Scramble</dt>
    <dd>Rotate each tile in a random direction.</dd>
    <dt class="text-right font-bold">Solve</dt>
    <dd>Try to solve the board.</dd>
    <dt class="text-right font-bold">Stop</dt>
    <dd>Stop a running solve</dd>
  </dl>

  <p>
    Made by <a href="https://tomhooijenga.nl/">Tom Hooijenga</a>. You can check
    the source on
    <a href="https://github.com/tomhooijenga/Infinity-loop-solver">Github.</a>
  </p>

  <Button class="block mx-auto" @click="$emit('close')">Close</Button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/Button.vue";

export default defineComponent({
  name: "About",
  components: {
    Button,
  },
  emits: ["close"],
});
</script>
