import { Grid as HexGrid } from "@/lib/solver/hex/Grid";
import { Grid as SquareGrid } from "@/lib/solver/square/Grid";
import { Grid as TriangleGrid } from "@/lib/solver/triangle/Grid";
import { HexSolverType, SquareSolverType, useSettings } from "@/use-settings";
import { SolverRun } from "@/lib/solver/base/SolverRun";
import { StepSolver } from "@/lib/solver/base/StepSolver";
import { NoneSolver } from "@/lib/solver/base/NoneSolver";
import { AllSideSolver } from "@/lib/solver/base/AllSideSolver";
import { SolveStep } from "@/lib/solver/base/SolveStep";
import { PatternStep } from "@/lib/solver/base/steps/PatternStep";
import * as hex from "@/lib/solver/hex/tiles";
import * as sq from "@/lib/solver/square/tiles";
import { FitStep } from "@/lib/solver/base/steps/FitStep";
import { BacktrackingSolver } from "@/lib/solver/base/BacktrackingSolver";
import { BruteForceSolver } from "@/lib/solver/base/BruteForceSolver";

const hexSteps = {
  line: new PatternStep(hex.Line, [[true], [false, false]]),
  turnS: new PatternStep(hex.TurnS, [
    [true, false],
    [false, true],
  ]),
  turnL: new PatternStep(hex.TurnL, [
    [false, false, false],
    [true, false, false],
    [false, false, true],
  ]),
  checkL: new PatternStep(hex.CheckL, [
    [true, true],
    [false, false],
    [true, false, true],
    [false, true, false],
  ]),
  checkR: new PatternStep(hex.CheckR, [
    [true, true],
    [false, false],
    [true, false, true],
    [false, true, false],
  ]),
  junction: new PatternStep(hex.Junction, [
    [true, false],
    [false, true],
  ]),
  knuckles: new PatternStep(hex.Knuckles, [
    [true, false],
    [false, true],
  ]),
  triangle: new PatternStep(hex.Triangle, [[true], [false]]),
  diamond: new PatternStep(hex.Diamond, [
    [true, true, true],
    [true, false, true, true],
    [true, true, false, true],
  ]),
  square: new PatternStep(hex.Square, [[false], [true, true]]),
  generic: new FitStep(),
};

export function hexSolver(grid: HexGrid): SolverRun {
  const {
    settings: {
      solvers: { hex: solvers },
    },
  } = useSettings();

  const run = new SolverRun();

  if (solvers.none) {
    run.add(new NoneSolver(grid));
  }

  if (solvers.all) {
    run.add(new AllSideSolver(grid));
  }

  const stepSolver: SolveStep[] = Object.entries(hexSteps)
    .filter(([name]) => solvers[name as HexSolverType])
    .map(([, step]) => step);

  if (stepSolver.length) {
    run.add(new StepSolver(grid, stepSolver));
  }

  if (solvers.backtracking) {
    run.add(new BacktrackingSolver(grid));
  }

  if (solvers.bruteforce) {
    run.add(new BruteForceSolver(grid));
  }

  return run;
}

const squareSteps = {
  line: new PatternStep(sq.Line, [[true], [false]]),
  turn: new PatternStep(sq.Turn, [
    [true, false],
    [false, true],
  ]),
  generic: new FitStep(),
};

export function squareSolver(grid: SquareGrid): SolverRun {
  const {
    settings: {
      solvers: { square: solvers },
    },
  } = useSettings();

  const run = new SolverRun();

  if (solvers.none) {
    run.add(new NoneSolver(grid));
  }

  if (solvers.all) {
    run.add(new AllSideSolver(grid));
  }

  const stepSolver: SolveStep[] = Object.entries(squareSteps)
    .filter(([name]) => solvers[name as SquareSolverType])
    .map(([, step]) => step);

  if (stepSolver.length) {
    run.add(new StepSolver(grid, stepSolver));
  }

  if (solvers.backtracking) {
    run.add(new BacktrackingSolver(grid));
  }

  if (solvers.bruteforce) {
    run.add(new BruteForceSolver(grid));
  }

  return run;
}

export function triangleSolver(grid: TriangleGrid): SolverRun {
  const {
    settings: {
      solvers: { triangle: solvers },
    },
  } = useSettings();

  const run = new SolverRun();

  if (solvers.none) {
    run.add(new NoneSolver(grid));
  }

  if (solvers.all) {
    run.add(new AllSideSolver(grid));
  }

  if (solvers.generic) {
    run.add(new StepSolver(grid, [new FitStep()]));
  }

  if (solvers.backtracking) {
    run.add(new BacktrackingSolver(grid));
  }

  if (solvers.bruteforce) {
    run.add(new BruteForceSolver(grid));
  }

  return run;
}
