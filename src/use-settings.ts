import { reactive } from "vue";

export type HexSolverType =
  | "none"
  | "all"
  | "line"
  | "turnS"
  | "turnL"
  | "checkL"
  | "checkR"
  | "junction"
  | "knuckles"
  | "triangle"
  | "diamond"
  | "square"
  | "generic"
  | "backtracking"
  | "bruteforce";

export type SquareSolverType =
  | "none"
  | "all"
  | "line"
  | "turn"
  | "generic"
  | "backtracking"
  | "bruteforce";

export type TriangleSolverType =
  | "none"
  | "all"
  | "generic"
  | "backtracking"
  | "bruteforce";

type Settings = {
  delay: number;

  solvers: {
    hex: Record<HexSolverType, boolean>;
    square: Record<SquareSolverType, boolean>;
    triangle: Record<TriangleSolverType, boolean>
  };
};

const state = (): Settings => ({
  delay: 200,

  solvers: {
    hex: {
      none: true,
      all: true,
      line: true,
      turnS: true,
      turnL: true,
      checkL: true,
      checkR: true,
      junction: true,
      knuckles: true,
      triangle: true,
      diamond: true,
      square: true,
      generic: true,
      backtracking: true,
      bruteforce: false,
    },
    square: {
      none: true,
      all: true,
      line: true,
      turn: true,
      generic: true,
      backtracking: true,
      bruteforce: false,
    },
    triangle: {
      none: true,
      all: true,
      generic: true,
      backtracking: true,
      bruteforce: false,
    },
  },
});

const settings = reactive<Settings>(state());

function reset() {
  Object.assign(settings, state());
}

export function useSettings() {
  return {
    settings,
    reset,
  };
}
