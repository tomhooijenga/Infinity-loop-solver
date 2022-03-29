export interface Solver {
  solve(): Generator<number, boolean>;
}
