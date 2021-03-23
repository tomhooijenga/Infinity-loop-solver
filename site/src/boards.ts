import { None } from '../../src/solver/base/None'
import { Turn, End, Cross, Line, Junction } from '../../src/solver/square/tiles'
import { Tile } from '../../src/solver/base/Tile'
import { Board } from '../../src/solver/square/Board'
import { NoneSolver } from '../../src/solver/base/solvers/NoneSolver'
import { AllSidesSolver } from '../../src/solver/base/solvers/AllSidesSolver'
import { LineSolver } from '../../src/solver/square/solvers/LineSolver'
import { FitSolver } from '../../src/solver/base/solvers/FitSolver'
import { TurnSolver } from '../../src/solver/square/solvers/TurnSolver'
import { DirectionUtil } from '../../src/solver/base/DirectionUtil'

type TileConstructor = new (...args: ConstructorParameters<typeof Tile>) => Tile;
export interface BoardData {
  tiles: Tile[],
  width: number;
  height: number;
}

function constructTiles (tiles: TileConstructor[], width: number): BoardData {
  return {
    width,
    height: Math.floor(tiles.length / width),
    tiles: tiles.map((Ctor, index) => new Ctor({
      x: index % width,
      y: Math.floor(index / width)
    }))
  }
}

const robot = (): BoardData => constructTiles([
  None, Turn, Turn, End,
  Turn, Cross, Cross, Turn,
  End, Line, Line, None,
  None, End, End, None
], 4)

const turns = (): BoardData => constructTiles([
  None, Turn, Turn, Turn, Turn, None,
  Turn, Turn, Turn, Turn, Turn, Turn,
  Turn, Turn, Turn, Turn, Turn, Turn,
  None, Turn, Turn, Turn, Turn, None
], 6)

const hard = (): BoardData => constructTiles([
  None, None, End, Line, Turn, None,
  End, Turn, Junction, Line, Cross, Turn,
  End, Line, Junction, Line, Junction, Line,
  Turn, Cross, Turn, End, Turn, Junction,
  Junction, Cross, End, Line, Turn, Junction,
  Turn, Cross, Junction, Junction, Junction, Turn,
  Turn, Cross, Junction, Turn, Line, End,
  Junction, Turn, Turn, Junction, Turn, End,
  Turn, Line, End, Turn, Turn, None
], 6)

const empty = (): BoardData => constructTiles(new Array(9).fill(None), 3)

export const boards = {
  empty,
  robot,
  turns,
  hard
}

DirectionUtil.NUM_SIDES = 4

export const solve = (tiles: Tile[]) => {
  tiles.forEach((tile) => {
    tile.solved = false
  })

  const board = new Board(tiles)

  return board.solve([
    new NoneSolver(board),
    new AllSidesSolver(board)
  ]) || board.solve([
    new LineSolver(board),
    new TurnSolver(board),
    new FitSolver(board)
  ])
}
