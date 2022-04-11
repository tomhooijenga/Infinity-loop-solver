import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";

export interface SolveStep {
  name: string;

  solveTile(tile: Tile, grid: Grid): boolean;
}
