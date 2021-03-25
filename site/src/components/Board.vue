<template>
  <div class="board-area">
    <component :is="`${boardData.type}-board`" :tiles="boardData.tiles" :x="boardData.width" :y="boardData.height" class="board" />
  </div>
  <section class="buttons">
    <button type="button" class="button" @click="scrambleBoard">Scramble</button>
    <button type="button" class="button" @click="solveBoard">Solve</button>
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { BoardData, solve } from '@/boards'
import { DirectionUtil } from '../../../src/solver/base/DirectionUtil'
import SquareBoard from '@/components/square/Board.vue'
import HexBoard from '@/components/hex/Board.vue'

export default {
  name: 'BoardArea',

  components: {
    SquareBoard,
    HexBoard
  },

  props: {
    boardData: Object as PropType<BoardData>
  },

  setup (props: { boardData: BoardData }) {
    const scrambleBoard = () => {
      props.boardData.tiles.forEach((tile) => {
        tile.rotate(DirectionUtil.random())
      })
    }

    const solveBoard = () => {
      solve(props.boardData.tiles)
    }

    return {
      scrambleBoard,
      solveBoard
    }
  }
}
</script>

<style scoped>
.board-area {
  background: #1d314b;
  grid-area: board;
  justify-content: center;
  min-height: 0;
}

.board {
  max-width: min(800px, 100%);
  max-height: min(800px, 100%);
}

.buttons {
  grid-area: controls;
  border-top: 1px solid #162539;
  padding: 1rem;
  text-align: center;
}
</style>
