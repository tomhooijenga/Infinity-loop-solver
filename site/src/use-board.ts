import { reactive } from 'vue'
import { BoardData, boards, empty } from '@/boards'
import { Tile } from '../../src/solver/base/Tile'
import { DirectionUtil } from '../../src/solver/base/DirectionUtil'
import { Generator } from '../../src/generator/generator'
import { Board as SquareBoard } from '../../src/solver/square/Board'
import { Board as HexBoard } from '../../src/solver/hex/Board'
import * as sq from '../../src/solver/square/tiles'
import * as hex from '../../src/solver/hex/tiles'

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

function generateBoard () {
  let generator

  if (board.type === 'square') {
    generator = new Generator(new SquareBoard([]), Object.values(sq))
  } else {
    generator = new Generator(new HexBoard([]), Object.values(hex))
  }

  const tiles = generator.generate(board.width, board.height)

  board.tiles = tiles
}

export function useBoard () {
  return {
    board,
    clearBoard,
    loadBoard,
    generateBoard,
    setTile
  }
}
