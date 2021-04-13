import { shallowReactive } from 'vue'
import { BoardData, boards } from '@/boards'
import { Tile } from '../../src/base/Tile'
import { Generator } from '../../src/generator/generator'
import { Grid as SquareGrid } from '../../src/solver/square/Grid'
import { Grid as HexGrid } from '../../src/solver/hex/Grid'
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

function generateBoard () {
  let generator: Generator

  if (board.type === 'square') {
    generator = new Generator(new SquareGrid([]), Object.values(sq))
  } else {
    generator = new Generator(new HexGrid([]), Object.values(hex))
  }

  board.tiles = generator.generate(board.width, board.height)
}

function scrambleBoard () {
  let b: SquareGrid | HexGrid

  if (board.type === 'square') {
    b = new SquareGrid()
  } else {
    b = new HexGrid()
  }

  board.tiles.forEach((tile) => {
    tile.direction = b.directionUtil.random()
  })

  board.tiles = [...board.tiles]
}

export function useBoard () {
  return {
    board,
    loadBoard,
    generateBoard,
    scrambleBoard,
    setTile
  }
}
