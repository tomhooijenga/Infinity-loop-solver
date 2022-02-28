import { Solver } from "@/lib/solver/base/Solver";

export class SolverRun {
  protected solvers: Solver[] = [];
  protected silent = new Set();

  public addSilent(...solvers: Solver[]): this {
    this.add(...solvers);
    solvers.forEach((solver) => this.silent.add(solver));
    return this;
  }

  public add(...solvers: Solver[]): this {
    this.solvers.push(...solvers);
    return this;
  }

  public *run(): Generator<number, boolean> {
    for (const solver of this.solvers) {
      let solved: boolean;

      if (this.silent.has(solver)) {
        solved = this.runSilent(solver);
      } else {
        solved = yield* solver.solve();
      }

      if (solved) {
        return true;
      }
    }

    return false;
  }

  protected runSilent(solver: Solver): boolean {
    const gen = solver.solve();
    let next = gen.next();

    while (!next.done) {
      next = gen.next();
    }

    return next.value;
  }
}
