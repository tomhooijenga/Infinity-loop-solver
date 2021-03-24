<template>
  <component :is="`${boardData.type}-board`"
             v-for="[name, boardData] of boards"
             v-once
             :key="name"
             :tiles="boardData.tiles"
             :x="boardData.width"
             :y="boardData.height"
             class="board"
             @click="$emit('change', name)"/>
</template>

<script>
import { boards } from '@/boards'
import SquareBoard from '@/components/square/Board'
import HexBoard from '@/components/hex/Board'

export default {
  name: 'Examples',

  components: {
    SquareBoard,
    HexBoard
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
