import { reactive, ref } from 'vue'
import { BoardData, boards, empty } from '@/boards'
import { Tile } from '../../src/solver/base/Tile'
import { DirectionUtil } from '../../src/solver/base/DirectionUtil'

const board = reactive<BoardData>({
  type: 'square',
  tiles: [],
  width: 0,
  height: 0
})

const clearBoard = () => {
  Object.assign(board, empty())
  DirectionUtil.NUM_SIDES = 4
}

const loadBoard = (name: keyof typeof boards) => {
  Object.assign(board, boards[name]())
  DirectionUtil.NUM_SIDES = board.type === 'square' ? 4 : 6
}

function setTile (index: number, tile: Tile) {
  board.tiles[index] = tile
}

export function useBoard () {
  return {
    board,
    clearBoard,
    loadBoard,
    setTile
  }
}
