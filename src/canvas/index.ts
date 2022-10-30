import { Tile } from "@/lib/base/Tile";
import { Grid } from "@/lib/base/Grid";

export * from "./resize";
export * from "./render";
export { renderer as hexRenderer } from "./hex";
export { renderer as squareRenderer } from "./square";
export { renderer as triangleRenderer } from "./triangle";

export type GridRenderer = {
  render(ctx: CanvasRenderingContext2D, grid: Grid, tile: Tile): void;

  ratio(grid: Grid): number;
};

export type TileRenderer = (
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  size: number,
  x: number,
  y: number
) => void;
