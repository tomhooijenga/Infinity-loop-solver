export { GridRenderer } from "./grid-renderer";
export { HexGridRenderer } from "./hex-grid-renderer";
export { SquareGridRenderer } from "./square-grid-renderer";
export { TriangleGridRenderer } from "./triangle-grid-renderer";

export type TileRenderer = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  x: number,
  y: number
) => void;
