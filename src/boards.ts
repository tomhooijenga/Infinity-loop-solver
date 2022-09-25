import { None } from "@/lib/base/None";
import * as tri from "@/lib/solver/triangle/tiles";
import * as sq from "@/lib/solver/square/tiles";
import * as hex from "@/lib/solver/hex/tiles";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { Grid as TriangleGrid } from "@/lib/solver/triangle/Grid";
import { Grid as SquareGrid } from "@/lib/solver/square/Grid";
import { Grid as HexGrid } from "@/lib/solver/hex/Grid";
import { hexSolver, squareSolver, triangleSolver } from "@/solvers";
import { SolveProgress } from "@/lib/solver/base/SolveProgress";

export interface BoardData {
  type: "triangle" | "square" | "hex";
  tiles: Tile[];
  width: number;
  height: number;
}

export function constructTiles(
  type: BoardData["type"],
  width: number,
  tiles: TileConstructor[]
): BoardData {
  return {
    type,
    width: Math.min(tiles.length, width),
    height: Math.ceil(tiles.length / width),
    tiles: tiles.map(
      (TileType, index) =>
        new TileType({
          x: index % width,
          y: Math.floor(index / width),
          solved: true,
        })
    ),
  };
}

const robot = (): BoardData =>
  constructTiles("square", 4, [
    None,
    sq.Turn,
    sq.Turn,
    sq.End,
    sq.Turn,
    sq.Cross,
    sq.Cross,
    sq.Turn,
    sq.End,
    sq.Line,
    sq.Line,
    None,
    None,
    sq.End,
    sq.End,
    None,
  ]);

const triangle = (): BoardData =>
  constructTiles("triangle", 5, [
    None,
    tri.End,
    tri.Triangle,
    tri.Turn,
    tri.End,
    None,
    tri.End,
    tri.Triangle,
    tri.Triangle,
    tri.End,
    None,
    None,
    None,
    tri.Turn,
    tri.End,
  ]);

const turns = (): BoardData =>
  constructTiles("square", 6, [
    None,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    None,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    None,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    sq.Turn,
    None,
  ]);

const hard = (): BoardData =>
  constructTiles("square", 6, [
    None,
    None,
    sq.End,
    sq.Line,
    sq.Turn,
    None,
    sq.End,
    sq.Turn,
    sq.Junction,
    sq.Line,
    sq.Cross,
    sq.Turn,
    sq.End,
    sq.Line,
    sq.Junction,
    sq.Line,
    sq.Junction,
    sq.Line,
    sq.Turn,
    sq.Cross,
    sq.Turn,
    sq.End,
    sq.Turn,
    sq.Junction,
    sq.Junction,
    sq.Cross,
    sq.End,
    sq.Line,
    sq.Turn,
    sq.Junction,
    sq.Turn,
    sq.Cross,
    sq.Junction,
    sq.Junction,
    sq.Junction,
    sq.Turn,
    sq.Turn,
    sq.Cross,
    sq.Junction,
    sq.Turn,
    sq.Line,
    sq.End,
    sq.Junction,
    sq.Turn,
    sq.Turn,
    sq.Junction,
    sq.Turn,
    sq.End,
    sq.Turn,
    sq.Line,
    sq.End,
    sq.Turn,
    sq.Turn,
    None,
  ]);

const heart = (): BoardData =>
  constructTiles("hex", 5, [
    None,
    hex.TurnL,
    None,
    hex.TurnL,
    None,
    hex.TurnL,
    None,
    hex.TurnL,
    None,
    hex.TurnL,
    hex.TurnL,
    hex.Line,
    None,
    hex.Line,
    hex.TurnL,
    None,
    None,
    hex.TurnL,
    None,
    None,
  ]);

const clover = (): BoardData =>
  constructTiles("hex", 5, [
    None,
    hex.TurnL,
    None,
    hex.TurnL,
    None,
    hex.TurnL,
    None,
    hex.Triangle,
    None,
    hex.TurnL,
    hex.TurnL,
    hex.Square,
    hex.Triangle,
    hex.Square,
    hex.TurnL,
    hex.TurnL,
    None,
    hex.Triangle,
    None,
    hex.TurnL,
    hex.TurnL,
    hex.TurnL,
    hex.Triangle,
    hex.TurnL,
    hex.TurnL,
  ]);

export const boards = {
  heart,
  robot,
  triangle,
  clover,
  turns,
  hard,
};

function solveTriangle(tiles: Tile[]) {
  const grid = new TriangleGrid(tiles);

  return triangleSolver(grid).run();
}

function solveSquare(tiles: Tile[]) {
  const grid = new SquareGrid(tiles);

  return squareSolver(grid).run();
}

function solveHex(tiles: Tile[]) {
  const grid = new HexGrid(tiles);

  return hexSolver(grid).run();
}
export function solve(boardData: BoardData): Generator<SolveProgress, boolean> {
  boardData.tiles.forEach((tile) => {
    tile.solved = false;
  });

  const solver = {
    triangle: solveTriangle,
    square: solveSquare,
    hex: solveHex,
  }[boardData.type];

  return solver(boardData.tiles);
}
