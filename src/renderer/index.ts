import { Tile, Tile as TileType } from "@/lib/base/Tile";
import { Grid as TriangleGrid } from "@/lib/solver/triangle/Grid";
import { Grid as SquareGrid } from "@/lib/solver/square/Grid";
import { Grid as HexGrid } from "@/lib/solver/hex/Grid";
import { SquareGridRenderer } from "@/renderer/square-grid-renderer";
import { HexGridRenderer } from "@/renderer/hex-grid-renderer";
import { TriangleGridRenderer } from "@/renderer/triangle-grid-renderer";
import { type GridRenderer } from "@/renderer/grid-renderer";

export { GridRenderer } from "@/renderer/grid-renderer";

export * as colors from "./colors";

export type TileRenderer = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  x: number,
  y: number
) => void;

export function factory(
  type: "triangle" | "square" | "hex",
  tiles: Tile[],
  ctx: CanvasRenderingContext2D
): GridRenderer {
  const renderers: Record<
    "triangle" | "square" | "hex",
    (tiles: TileType[], ctx: CanvasRenderingContext2D) => GridRenderer
  > = {
    triangle: (tiles, ctx) =>
      new TriangleGridRenderer(new TriangleGrid(tiles), ctx),
    square: (tiles, ctx) => new SquareGridRenderer(new SquareGrid(tiles), ctx),
    hex: (tiles, ctx) => new HexGridRenderer(new HexGrid(tiles), ctx),
  };

  return renderers[type](tiles, ctx);
}
