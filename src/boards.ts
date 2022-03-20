import { None } from "@/lib/base/None";
import * as sq from "@/lib/solver/square/tiles";
import * as hex from "@/lib/solver/hex/tiles";
import { Tile, TileConstructor } from "@/lib/base/Tile";
import { Grid as SquareGrid } from "@/lib/solver/square/Grid";
import { Grid as HexGrid } from "@/lib/solver/hex/Grid";
import { NoneStep } from "@/lib/solver/base/steps/NoneStep";
import { AllSideStep } from "@/lib/solver/base/steps/AllSideStep";
import { FitStep } from "@/lib/solver/base/steps/FitStep";
import { PatternStep } from "@/lib/solver/base/steps/PatternStep";
import { StepSolver } from "@/lib/solver/base/StepSolver";
import { BacktrackingSolver } from "@/lib/solver/base/BacktrackingSolver";
import { BruteForceSolver } from "@/lib/solver/base/BruteForceSolver";
import { SolverRun } from "@/lib/solver/base/SolverRun";

export interface BoardData {
  type: "square" | "hex";
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
  clover,
  turns,
  hard,
};

function solveSquare(tiles: Tile[]) {
  const grid = new SquareGrid(tiles);

  return new SolverRun()
    .addSilent(new StepSolver(grid, [new NoneStep(), new AllSideStep()]))
    .add(
      new StepSolver(grid, [
        new PatternStep(sq.Line, [[true], [false]]),
        new PatternStep(sq.Turn, [
          [true, false],
          [false, true],
        ]),
        new FitStep(),
      ]),
      new BacktrackingSolver(grid),
      new BruteForceSolver(grid, 13)
    )
    .run();
}

function solveHex(tiles: Tile[]) {
  const grid = new HexGrid(tiles);

  return new SolverRun()
    .addSilent(new StepSolver(grid, [new NoneStep(), new AllSideStep()]))
    .add(
      new StepSolver(grid, [
        new PatternStep(hex.Line, [[true], [false, false]]),
        new PatternStep(hex.TurnS, [
          [true, false],
          [false, true],
        ]),
        new PatternStep(hex.TurnL, [
          [false, false, false],
          [true, false, false],
          [false, false, true],
        ]),
        new PatternStep(hex.CheckL, [
          [true, true],
          [false, false],
          [true, false, true],
          [false, true, false],
        ]),
        new PatternStep(hex.CheckR, [
          [true, true],
          [false, false],
          [true, false, true],
          [false, true, false],
        ]),
        new PatternStep(hex.Junction, [
          [true, false],
          [false, true],
        ]),
        new PatternStep(hex.Knuckles, [
          [true, false],
          [false, true],
        ]),
        new PatternStep(hex.Triangle, [[true], [false]]),
        new PatternStep(hex.Diamond, [
          [true, true, true],
          [true, false, true, true],
          [true, true, false, true],
        ]),
        new PatternStep(hex.Square, [[false], [true, true]]),
        new FitStep(),
      ]),
      new BacktrackingSolver(grid),
      new BruteForceSolver(grid, 10)
    )
    .run();
}

export function solve(boardData: BoardData): Generator {
  boardData.tiles.forEach((tile) => {
    tile.solved = false;
  });

  if (boardData.type === "square") {
    return solveSquare(boardData.tiles);
  } else {
    return solveHex(boardData.tiles);
  }
}
