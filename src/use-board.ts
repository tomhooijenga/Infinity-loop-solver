import { reactive, readonly } from "vue";
import { BoardData, boards } from "@/boards";
import { Tile } from "@/lib/base/Tile";
import { Generator } from "@/lib/generator/generator";
import { Grid as TriangleGrid } from "@/lib/solver/triangle/Grid";
import { Grid as SquareGrid } from "@/lib/solver/square/Grid";
import { Grid as HexGrid } from "@/lib/solver/hex/Grid";
import * as tri from "@/lib/solver/triangle/tiles";
import * as sq from "@/lib/solver/square/tiles";
import * as hex from "@/lib/solver/hex/tiles";

const board = reactive<BoardData>({
  type: "square",
  tiles: [],
  width: 0,
  height: 0,
});

const highlighted = reactive(new Set<Tile>());

const loadBoard = (name: keyof typeof boards) => {
  Object.assign(board, boards[name]());
};

function setTile(index: number, tile: Tile) {
  board.tiles[index] = tile;
  board.tiles = [...board.tiles];
}

function makeGrid() {
  return new {
    triangle: TriangleGrid,
    square: SquareGrid,
    hex: HexGrid,
  }[board.type]();
}

function generateBoard() {
  const grid = makeGrid();
  const tiles = {
    triangle: tri,
    square: sq,
    hex: hex,
  }[board.type];
  const generator = new Generator(grid, Object.values(tiles));

  board.tiles = generator.generate(board.width, board.height);
}

function scrambleBoard() {
  const grid = makeGrid();

  board.tiles.forEach((tile) => {
    tile.direction = grid.directionUtil.random();
  });

  board.tiles = [...board.tiles];
}

function highlight(tiles: Tile[]) {
  highlighted.clear();
  tiles.forEach((tile) => highlighted.add(tile));
}

function isHighlighted(tile: Tile): boolean {
  return highlighted.has(tile);
}

export function useBoard() {
  return {
    board,
    highlighted: readonly(highlighted),
    loadBoard,
    generateBoard,
    scrambleBoard,
    setTile,
    highlight,
    isHighlighted,
  };
}
