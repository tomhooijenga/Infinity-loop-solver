import { Solver } from "@/lib/solver/base/Solver";
import { SolveProgress } from "@/lib/solver/base/SolveProgress";

export class SolverRun {
  protected solvers: Solver[] = [];

  public add(...solvers: Solver[]): this {
    this.solvers.push(...solvers);
    return this;
  }

  public *run(): Generator<SolveProgress, boolean> {
    for (const solver of this.solvers) {
      if (yield* solver.solve()) {
        return true;
      }
    }

    return false;
  }
}
