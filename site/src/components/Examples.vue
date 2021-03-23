<template>
  <square-board v-once
                v-for="[name, board] of boards"
                :key="board"
                :tiles="board.tiles"
                :x="board.width"
                :y="board.height"
                class="board"
                @click="$emit('change', name)"/>
</template>

<script>
import { boards } from '@/boards'
import Board from '@/components/square/Board'

export default {
  name: 'Examples',

  components: {
    SquareBoard: Board
  },

  emits: ['change'],

  setup () {
    return {
      boards: Object.entries(boards).map(([name, board]) => [name, board()])
    }
  }
}
</script>

<style scoped>

.board {
  margin: 1rem;
  background: #1d314b;
}
</style>
