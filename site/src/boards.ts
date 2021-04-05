import { None } from '../../src/solver/base/None'
import * as sq from '../../src/solver/square/tiles'
import * as hex from '../../src/solver/hex/tiles'
import { Tile, TileConstructor } from '../../src/solver/base/Tile'
import { Board as SquareBoard } from '../../src/solver/square/Board'
import { Board as HexBoard } from '../../src/solver/hex/Board'
import { NoneSolver } from '../../src/solver/base/solvers/NoneSolver'
import { AllSidesSolver } from '../../src/solver/base/solvers/AllSidesSolver'
import { FitSolver } from '../../src/solver/base/solvers/FitSolver'
import { PatternSolver } from '../../src/solver/base/solvers/PatternSolver'

export interface BoardData {
  type: 'square' | 'hex';
  tiles: Tile[];
  width: number;
  height: number;
}

export function constructTiles (type: BoardData['type'], width: number, tiles: TileConstructor[]): BoardData {
  return {
    type,
    width: Math.min(tiles.length, width),
    height: Math.ceil(tiles.length / width),
    tiles: tiles.map((Ctor, index) => new Ctor({
      x: index % width,
      y: Math.floor(index / width),
      solved: true
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

const heart = (): BoardData => constructTiles('hex', 5, [
  None, hex.TurnL, None, hex.TurnL, None,
  hex.TurnL, None, hex.TurnL, None, hex.TurnL,
  hex.TurnL, hex.Line, None, hex.Line, hex.TurnL,
  None, None, hex.TurnL, None, None
])

const clover = (): BoardData => constructTiles('hex', 5, [
  None, hex.TurnL, None, hex.TurnL, None,
  hex.TurnL, None, hex.Triangle, None, hex.TurnL,
  hex.TurnL, hex.Square, hex.Triangle, hex.Square, hex.TurnL,
  hex.TurnL, None, hex.Triangle, None, hex.TurnL,
  hex.TurnL, hex.TurnL, hex.Triangle, hex.TurnL, hex.TurnL
])

export const boards = {
  heart,
  robot,
  clover,
  turns,
  hard
}

function solveSquare (tiles: Tile[]): boolean {
  const board = new SquareBoard(tiles)

  return [
    board.solve([
      new NoneSolver(board),
      new AllSidesSolver(board)
    ]),
    board.solve([
      new PatternSolver(board, sq.Line, [[true], [false]]),
      new PatternSolver(board, sq.Turn, [[true, false], [false, true]]),
      new FitSolver(board)
    ]),
    // board.solve([
    //   new ForceSolver(board)
    // ])
  ].some(Boolean)
}

function solveHex (tiles: Tile[]): boolean {
  const board = new HexBoard(tiles)

  return [
    board.solve([
      new NoneSolver(board),
      new AllSidesSolver(board)
    ]),
    board.solve([
      new PatternSolver(board, hex.Line, [[true], [false, false]]),
      new PatternSolver(board, hex.TurnS, [[true, false], [false, true]]),
      new PatternSolver(board, hex.TurnL, [
        [false, false, false],
        [true, false, false],
        [false, false, true]
      ]),
      new PatternSolver(board, hex.CheckL, [
        [true, true],
        [false, false],
        [true, false, true],
        [false, true, false]
      ]),
      new PatternSolver(board, hex.CheckR, [
        [true, true],
        [false, false],
        [true, false, true],
        [false, true, false]
      ]),
      new PatternSolver(board, hex.Junction, [[true, false], [false, true]]),
      new PatternSolver(board, hex.Knuckles, [[true, false], [false, true]]),
      new PatternSolver(board, hex.Triangle, [[true], [false]]),
      new PatternSolver(board, hex.Diamond, [[true, true, true], [true, false, true, true], [true, true, false, true]]),
      new PatternSolver(board, hex.Square, [[false], [true, true]]),
      new FitSolver(board)
    ]),
    // board.solve([
    //   new ForceSolver(board)
    // ])
  ].some(Boolean)
}

export function solve (boardData: BoardData): boolean {
  boardData.tiles.forEach((tile) => {
    tile.solved = false
  })

  if (boardData.type === 'square') {
    return solveSquare(boardData.tiles)
  } else {
    return solveHex(boardData.tiles)
  }
}
