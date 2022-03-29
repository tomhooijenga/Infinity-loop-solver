<template>
  <h1 id="settings">Settings</h1>

  <section>
    <div class="row">
      <span class="radio">
        <div class="label">Tile shape</div>

        <label>
          Square
          <input
            v-model="settings.type"
            type="radio"
            name="type"
            value="square"
          />
        </label>

        <label>
          Hexagon
          <input v-model="settings.type" type="radio" name="type" value="hex" />
        </label>
      </span>
    </div>

    <div class="row">
      <label class="input">
        <span class="label">Animation delay</span>
        <input
          v-model.number="settings.delay"
          type="number"
          min="0"
          max="500"
          step="50"
        />
      </label>
      <span class="input-times">ms</span>
    </div>

    <div class="row">
      <label class="input">
        <span class="label">Width</span>
        <input v-model.number="settings.width" min="0" type="number" />
      </label>
      <span class="input-times">&times;</span>
      <label class="input">
        <span class="label">Height</span>
        <input v-model.number="settings.height" min="0" type="number" />
      </label>
    </div>
  </section>

  <div class="buttons">
    <button type="button" @click="reset">Reset</button>
    <button type="button" @click="apply">Apply</button>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, watch } from "vue";
import { useBoard } from "@/use-board";
import { None } from "@/lib/base/None";
import { constructTiles } from "@/boards";
import { useSettings } from "@/use-settings";

export default defineComponent({
  name: "Settings",

  emits: ["close"],

  setup() {
    const { board, loadBoard, generateBoard } = useBoard();
    const { settings, reset: settingsReset } = useSettings();

    const { type, width, height } = board;

    const newSettings = reactive({
      type,
      width,
      height,
      delay: settings.delay,
    });

    watch(board, () => {
      Object.assign(newSettings, board);
    });

    function reset() {
      loadBoard("heart");
      settingsReset();
      newSettings.delay = settings.delay;
    }

    function apply() {
      const { type, width, height, delay } = newSettings;
      if (
        type !== board.type ||
        width !== board.width ||
        height !== board.height
      ) {
        const tiles = new Array(width * height).fill(None);
        Object.assign(board, constructTiles(type, width, tiles));
      }

      settings.delay = delay;

      generateBoard();
    }

    return {
      settings: newSettings,
      reset,
      apply,
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

.row {
  display: flex;

  + .row {
    margin-top: 2rem;
  }
}

.label {
  font-size: 0.8rem;
  color: #cccccc;
  text-align: left;
  padding: 0.5rem;
}

.input {
  > input {
    font-size: 2rem;
    padding: 0.5rem;
    color: whitesmoke;
    border: solid $color-default-darker;
    border-width: 0 0 2px 0;
    background: none;
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
    box-sizing: border-box;
  }
}

.input-times {
  margin: auto 1rem;
}

.radio {
  > label {
    background: $color-default-darker;
    color: #f5f5f5;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin-top: 0.5rem;
    border-radius: 20rem;
    display: inline-block;
  }

  > label + label {
    margin-left: 1rem;
  }
}

.buttons {
  margin-top: 1rem;
  text-align: center;
}
</style>
