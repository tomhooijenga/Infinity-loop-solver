<template>
  <div class="board-area">
    <component :is="`${board.type}-board`"
               :tiles="board.tiles"
               :x="board.width"
               :y="board.height"
               @change="nextTile"
               class="board" />
  </div>
  <section class="buttons">
    <button type="button" class="button" @click="scrambleBoard">Scramble</button>
    <button type="button" class="button" @click="solveBoard">Solve</button>
  </section>
</template>

<script lang="ts">
import { BoardData, solve } from '@/boards'
import { DirectionUtil } from '../../../src/solver/base/DirectionUtil'
import SquareBoard from '@/components/square/Board.vue'
import HexBoard from '@/components/hex/Board.vue'
import { useBoard } from '@/use-board'
import { Tile, TileConstructor } from '../../../src/solver/base/Tile'
import * as sq from '../../../src/solver/square/tiles'
import * as hex from '../../../src/solver/hex/tiles'
import { None } from '../../../src/solver/base/None'

const order: Record<BoardData['type'], TileConstructor[]> = {
  square: [None, sq.End, sq.Line, sq.Turn, sq.Junction, sq.Cross],
  hex: [None, hex.End, hex.TurnS, hex.TurnL, hex.Line, hex.Junction, hex.CheckL, hex.CheckR, hex.Triangle, hex.Diamond, hex.Square, hex.Star]
}

export default {
  name: 'BoardArea',

  components: {
    SquareBoard,
    HexBoard
  },

  setup () {
    const { board, setTile } = useBoard()

    function scrambleBoard () {
      board.tiles.forEach((tile) => {
        tile.rotate(DirectionUtil.random())
      })
    }

    function solveBoard () {
      solve(board)
    }

    function nextTile (index: number, tile: Tile, direction: -1 | 1) {
      const typeOrder = order[board.type]
      const typeIndex = (typeOrder.indexOf(tile.constructor as TileConstructor) + direction) % typeOrder.length
      const Tile = typeOrder[typeIndex]

      setTile(index, new Tile({
        x: tile.x,
        y: tile.y
      }))
    }

    return {
      board,
      scrambleBoard,
      solveBoard,
      nextTile
    }
  }
}
</script>

<style scoped>
.board-area {
  background: #1d314b;
  grid-area: board;
  min-height: 0;
}

.board {
  max-width: min(800px, 100%);
  max-height: min(800px, 100%);
  margin: 0 auto;
}

.buttons {
  grid-area: controls;
  border-top: 1px solid #162539;
  padding: 1rem;
  text-align: center;
}
</style>