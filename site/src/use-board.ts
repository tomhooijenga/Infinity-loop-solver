import { shallowReactive, watch } from 'vue'
import { BoardData, boards } from '@/boards'
import { Tile } from '../../src/solver/base/Tile'
import { DirectionUtil } from '../../src/solver/base/DirectionUtil'
import { Generator } from '../../src/generator/generator'
import { Grid as SquareBoard } from '../../src/solver/square/Grid'
import { Grid as HexBoard } from '../../src/solver/hex/Grid'
import * as sq from '../../src/solver/square/tiles'
import * as hex from '../../src/solver/hex/tiles'

const board = shallowReactive<BoardData>({
  type: 'square',
  tiles: [],
  width: 0,
  height: 0
})

const loadBoard = (name: keyof typeof boards) => {
  Object.assign(board, boards[name]())
}

function setTile (index: number, tile: Tile) {
  const { tiles } = board
  tiles[index] = tile
  board.tiles = [...tiles]
}

watch(() => board.type, () => {
  DirectionUtil.NUM_SIDES = board.type === 'square' ? 4 : 6
})

function generateBoard () {
  let generator

  if (board.type === 'square') {
    generator = new Generator(new SquareBoard([]), Object.values(sq))
  } else {
    generator = new Generator(new HexBoard([]), Object.values(hex))
  }

  board.tiles = generator.generate(board.width, board.height)
}

export function useBoard () {
  return {
    board,
    loadBoard,
    generateBoard,
    setTile
  }
}
