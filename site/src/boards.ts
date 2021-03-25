import { None } from '../../src/solver/base/None'
import * as sq from '../../src/solver/square/tiles'
import * as hex from '../../src/solver/hex/tiles'
import { Tile, TileConstructor } from '../../src/solver/base/Tile'
import { Board } from '../../src/solver/square/Board'
import { NoneSolver } from '../../src/solver/base/solvers/NoneSolver'
import { AllSidesSolver } from '../../src/solver/base/solvers/AllSidesSolver'
import { LineSolver } from '../../src/solver/square/solvers/LineSolver'
import { FitSolver } from '../../src/solver/base/solvers/FitSolver'
import { TurnSolver } from '../../src/solver/square/solvers/TurnSolver'
import { ForceSolver } from '../../src/solver/base/solvers/ForceSolver'

export interface BoardData {
  type: 'square' | 'hex';
  tiles: Tile[];
  width: number;
  height: number;
}

function constructTiles (type: BoardData['type'], width: number, tiles: TileConstructor[]): BoardData {
  return {
    type,
    width: Math.min(tiles.length, width),
    height: Math.ceil(tiles.length / width),
    tiles: tiles.map((Ctor, index) => new Ctor({
      x: index % width,
      y: Math.floor(index / width)
    }))
  }
}

const robot = (): BoardData => constructTiles('square', 4, [
  None, sq.Turn, sq.Turn, sq.End,
  sq.Turn, sq.Cross, sq.Cross, sq.Turn,
  sq.End, sq.Line, sq.Line, None,
  None, sq.End, sq.End, None
])

const turns = (): BoardData => constructTiles('square', 6, [
  None, sq.Turn, sq.Turn, sq.Turn, sq.Turn, None,
  sq.Turn, sq.Turn, sq.Turn, sq.Turn, sq.Turn, sq.Turn,
  sq.Turn, sq.Turn, sq.Turn, sq.Turn, sq.Turn, sq.Turn,
  None, sq.Turn, sq.Turn, sq.Turn, sq.Turn, None
])

const hard = (): BoardData => constructTiles('square', 6, [
  None, None, sq.End, sq.Line, sq.Turn, None,
  sq.End, sq.Turn, sq.Junction, sq.Line, sq.Cross, sq.Turn,
  sq.End, sq.Line, sq.Junction, sq.Line, sq.Junction, sq.Line,
  sq.Turn, sq.Cross, sq.Turn, sq.End, sq.Turn, sq.Junction,
  sq.Junction, sq.Cross, sq.End, sq.Line, sq.Turn, sq.Junction,
  sq.Turn, sq.Cross, sq.Junction, sq.Junction, sq.Junction, sq.Turn,
  sq.Turn, sq.Cross, sq.Junction, sq.Turn, sq.Line, sq.End,
  sq.Junction, sq.Turn, sq.Turn, sq.Junction, sq.Turn, sq.End,
  sq.Turn, sq.Line, sq.End, sq.Turn, sq.Turn, None
])

const empty = (): BoardData => constructTiles('square', 3, new Array(9).fill(None))

const ends = (): BoardData => constructTiles('hex', 4, [
  None, None,
  hex.End, hex.TurnL, hex.End,
  ...Object.values(hex),
  ...Object.values(hex)
])

export const boards = {
  ends,
  empty,
  robot,
  turns,
  hard
}

export const solve = (tiles: Tile[]): boolean => {
  tiles.forEach((tile) => {
    tile.solved = false
  })

  const board = new Board(tiles)

  return [
    board.solve([
      new NoneSolver(board),
      new AllSidesSolver(board)
    ]),
    board.solve([
      new LineSolver(board),
      new TurnSolver(board),
      new FitSolver(board)
    ]),
    board.solve([
      new ForceSolver(board)
    ])
  ].some(x => {
    console.log(x)
    return x
  })
}
