import { HexSolverType, SquareSolverType } from "@/use-settings";

type SolverDescription = {
  hex: SolverDescriptionGroup<HexSolverType>[]
  square: SolverDescriptionGroup<SquareSolverType>[]
}

type SolverDescriptionGroup<T extends string> = {
  name: string;
  description: string;
  solvers: Partial<Record<T, string>>
}

const descriptions: SolverDescription = {
  hex: [
    {
      name: "Instant solvers",
      description: "",
      solvers: {
        none: "Empty tiles",
        all: "Filled tiles",
      },
    },
    {
      name: "Shortcut fit solvers",
      description: "Solvers that need less known sides to solve a tile.",
      solvers: {
        line: "Line",
        turnS: "Turn (small)",
        turnL: "Turn (big)",
        checkL: "Checkmark (left)",
        checkR: "Checkmark (right)",
        junction: "Junction",
        knuckles: "Knuckles",
        triangle: "Triangle",
        diamond: "Diamond",
        square: "Square",
      },
    },
    {
      name: "Generic fit solver",
      description:
        "Solvers that finds a fit by trying each side. It can only find a fit if all open or closed sides are known.",
      solvers: {
        generic: "Generic fit",
      },
    },
    {
      name: "Expensive solvers",
      description:
        "Brute force checks each and every possible position until there is a solution. Backtracking does this as well, but more intelligent.",
      solvers: {
        backtracking: "Backtracking",
        bruteforce: "Brute force",
      },
    },
  ],
  square: [
    {
      name: "Instant solvers",
      description: "",
      solvers: {
        none: "Empty tiles",
        all: "Filled tiles",
      },
    },
    {
      name: "Shortcut fit solvers",
      description: "Solvers that need less known sides to solve a tile.",
      solvers: {
        line: "Line",
        turn: "Turn",
      },
    },
    {
      name: "Generic fit solver",
      description:
        "Solvers that finds a fit by trying each side. It can only find a fit if all open or closed sides are known.",
      solvers: {
        generic: "Generic fit",
      },
    },
    {
      name: "Expensive solvers",
      description:
        "Brute force checks each and every possible position until there is a solution. Backtracking does this as well, but more intelligent.",
      solvers: {
        backtracking: "Backtracking",
        bruteforce: "Brute force",
      },
    },
  ],
};

export default descriptions;
