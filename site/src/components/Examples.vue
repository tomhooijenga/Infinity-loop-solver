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
import SquareBoard from '@/components/square/Grid'
import HexBoard from '@/components/hex/Grid'

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

<style scoped lang="scss">
@import "@/assets/theme";

.board {
  margin: 1rem;
  background: $board-bg;
}
</style>
