import { Tile } from "@/lib/base/Tile";

export interface SolveProgress {
  solver: string;
  tiles: Tile[],
}