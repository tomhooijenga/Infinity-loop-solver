<template>
  <div class="board-area">
    <component :is="`${board.type}-grid`"
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
import { DirectionUtil } from '../../../src/base/DirectionUtil'
import HexGrid from '@/components/hex/Grid.vue'
import SquareGrid from '@/components/square/Grid.vue'
import { useBoard } from '@/use-board'
import { Tile, TileConstructor } from '../../../src/base/Tile'
import * as hex from '../../../src/solver/hex/tiles'
import * as sq from '../../../src/solver/square/tiles'
import { None } from '../../../src/base/None'
import { useSettings } from '@/use-settings'

const order: Record<BoardData['type'], TileConstructor[]> = {
  hex: [None, hex.End, hex.TurnS, hex.TurnL, hex.Line, hex.Junction, hex.CheckL, hex.CheckR, hex.Triangle, hex.Diamond, hex.Square, hex.Knuckles, hex.Star],
  square: [None, sq.End, sq.Line, sq.Turn, sq.Junction, sq.Cross]
}

export default {
  name: 'BoardArea',

  components: {
    HexGrid,
    SquareGrid
  },

  setup () {
    const { board, setTile } = useBoard()
    const { settings } = useSettings()

    function scrambleBoard (): void {
      board.tiles.forEach((tile) => {
        tile.rotate(DirectionUtil.random())
      })

      board.tiles = [...board.tiles]
    }

    function sleep (): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, settings.delay))
    }

    async function solveBoard () {
      const progress = solve(board)

      while (!progress.next().done) {
        board.tiles = [...board.tiles]

        if (settings.delay > 0) {
          await sleep()
        }
      }
    }

    function nextTile (index: number, tile: Tile, direction: -1 | 1): void {
      const typeOrder = order[board.type]
      let typeIndex = (typeOrder.indexOf(tile.constructor as TileConstructor) + direction) % typeOrder.length
      if (typeIndex < 0) {
        typeIndex += typeOrder.length
      }
      const TileType = typeOrder[typeIndex]

      setTile(index, new TileType({
        solved: true,
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

<style scoped lang="scss">
@import "@/assets/theme";

.board-area {
  background: $board-bg;
  grid-area: board;
  min-height: 0;
}

.board {
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}

.buttons {
  grid-area: controls;
  padding: 1rem;
  text-align: center;
}
</style>
