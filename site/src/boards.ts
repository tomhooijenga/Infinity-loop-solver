import { None } from '../../src/solver/base/None'
import * as sq from '../../src/solver/square/tiles'
import { Tile } from '../../src/solver/base/Tile'

type TileConstructor = new (...args: ConstructorParameters<typeof Tile>) => Tile;

function arrayToBoard (tiles: TileConstructor[], width: number) {
  return tiles.map((Ctor, index) => new Ctor({
    x: index % width,
    y: Math.floor(index / width)
  }))
}

const robot = (): Tile[] => arrayToBoard([
  None, sq.Turn, sq.Turn, sq.End,
  sq.Turn, sq.Cross, sq.Cross, sq.Turn,
  sq.End, sq.Line, sq.Line, None,
  None, sq.End, sq.End, None
], 4)

const empty = (): None[] => arrayToBoard(new Array(9).fill(None), 3)

export const boards = {
  empty,
  robot
}
