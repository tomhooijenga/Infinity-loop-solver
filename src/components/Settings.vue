<template>
  <h1 id="settings" class="pt-14 -mt-8">Settings</h1>

  <section class="bg-light p-4 space-y-8">
    <div class="flex gap-2 flex-wrap">
      <div class="w-full">Tile shape</div>

      <label class="inline-block bg-dark py-2 px-4 rounded-full items-center">
        <input
          type="radio"
          name="type"
          value="triangle"
          class="mr-1"
          :checked="board.type === 'triangle'"
          @change="update({ type: 'triangle' })"
        />
        Triangle
      </label>

      <label class="inline-block bg-dark py-2 px-4 rounded-full items-center">
        <input
          type="radio"
          name="type"
          value="square"
          class="mr-1"
          :checked="board.type === 'square'"
          @change="update({ type: 'square' })"
        />
        Square
      </label>

      <label class="inline-block bg-dark py-2 px-4 rounded-full items-center">
        <input
          type="radio"
          name="type"
          value="hex"
          class="mr-1"
          :checked="board.type === 'hex'"
          @change="update({ type: 'hex' })"
        />
        Hexagon
      </label>
    </div>

    <div class="flex">
      <label >
        <span class="text-sm text-neutral/70">Animation delay</span>
        <input
          class="text-xl p-2 border-b-2 border-b-dark bg-transparent block w-full"
          v-model.number="settings.delay"
          type="number"
          min="0"
          max="500"
          step="50"
        />
      </label>
      <span class="mt-auto mb-2 ml-4 text-neutral/70">ms</span>
    </div>

    <div class="flex">
      <label >
        <span class="text-sm text-neutral/70">Width</span>
        <input
          class="text-xl p-2 border-b-2 border-b-dark bg-transparent block w-full"
          v-model.number="board.width"
          min="1"
          type="number"
          @change="update()"
        />
      </label>
      <span class="mt-auto mb-2 mx-4 text-neutral/70">&times;</span>
      <label >
        <span class="text-sm text-neutral/70">Height</span>
        <input
          class="text-xl p-2 border-b-2 border-b-dark bg-transparent block w-full"
          v-model.number="board.height"
          min="1"
          type="number"
          @change="update()"
        />
      </label>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useBoard } from "@/use-board";
import { None } from "@/lib/base/None";
import { BoardData, constructTiles } from "@/boards";
import { useSettings } from "@/use-settings";

export default defineComponent({
  name: "Settings",

  emits: ["close"],

  setup() {
    const { board, generateBoard } = useBoard();
    const { settings } = useSettings();

    function update(settings: Partial<BoardData> = {}) {
      const { type, width, height } = { ...board, ...settings };
      const tiles = new Array(width * height).fill(None);
      Object.assign(board, constructTiles(type, width, tiles));

      generateBoard();
    }

    return {
      board,
      settings,
      update,
    };
  },
});
</script>
