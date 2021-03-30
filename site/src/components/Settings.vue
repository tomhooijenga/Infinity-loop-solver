<template>
  <div class="row">
    <span class="radio">
      <div class="label">Type</div>

      <label>
        Square
        <input v-model="settings.type" type="radio" name="type" value="square"/>
      </label>

      <label>
        Hexagon
        <input v-model="settings.type" type="radio" name="type" value="hex"/>
      </label>
    </span>
  </div>

  <div class="row">
    <label class="input">
      <span class="label">Width</span>
      <input v-model.number="settings.width" min="0" type="number"/>
    </label>
    <span class="input-times">&times;</span>
    <label class="input">
      <span class="label">Height</span>
      <input v-model.number="settings.height" min="0" type="number"/>
    </label>
  </div>

  <div class="buttons">
    <button type="button" @click="$emit('close')">Cancel</button>
    <button type="button" @click="apply">Apply</button>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue'
import { useBoard } from '@/use-board'
import { None } from '../../../src/solver/base/None'
import { constructTiles } from '@/boards'
import { TileConstructor } from '../../../src/solver/base/Tile'

export default defineComponent({
  name: 'Settings',

  emits: ['close'],

  setup (_: unknown, { emit }) {
    const { board } = useBoard()

    const { type, width, height } = board

    const settings = reactive({
      type,
      width,
      height
    })

    function apply () {
      const { type, width, height } = settings
      const newLength = width * height

      let tiles: TileConstructor[]

      if (type === board.type) {
        tiles = board.tiles.map((tile) => tile.constructor as TileConstructor)
      } else {
        tiles = new Array(newLength).fill(None)
      }

      if (tiles.length > newLength) {
        tiles = tiles.slice(0, newLength)
      } else if (tiles.length < newLength) {
        tiles = tiles.concat(
          new Array(newLength - tiles.length).fill(None)
        )
      }

      Object.assign(board, constructTiles(type, width, tiles))
      emit('close')
    }

    return {
      settings,
      apply
    }
  }
})
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  margin-bottom: 2rem;
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
    border: solid #1d314b;
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
    background: #1d314b;
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
  text-align: center;
}
</style>
