import { SolveProgress } from "@/lib/solver/base/SolveProgress";

export interface Solver {
  name: string;

  solve(): Generator<SolveProgress, boolean>;
}
