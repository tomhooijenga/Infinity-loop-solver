// import { GridRenderer } from "@/canvas/index";
// import { Grid } from "@/lib/base/Grid";
// import { Tile } from "@/lib/base/Tile";
//
// function ratio(grid: Grid) {
//   const tileRatio = 1.1547;
//
//   // Horizontally, each tile shares a "wing"
//   const width = grid.width * 0.75 * tileRatio + 0.25 * tileRatio;
//
//   let height = grid.height;
//
//   // Add half a tile if an odd columns have an even count
//   if ((grid.tiles.length % grid.width) % 2 === 0) {
//     height += 0.5;
//   }
//
//   return width / height;
// }
//
// function render(ctx: CanvasRenderingContext2D, grid: Grid, tile: Tile) {
//   //
// }
//
// export const renderer: GridRenderer = {
//   ratio,
//   render,
// };

import { GridRenderer } from "@/canvas/grid-renderer";
import { TileRenderer } from "@/canvas/index";

export class HexGridRenderer extends GridRenderer {
  tileRenderers: Record<string, TileRenderer> = {
    None: () => null,
  };

  ratio(): number {
    return 0;
  }

  tileSize(): { width: number; height: number } {
    return { height: 0, width: 0 };
  }
}
