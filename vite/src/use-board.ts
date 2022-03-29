import { shallowReactive } from "vue";
import { BoardData, boards } from "@/boards";
import { Tile } from "@/lib/base/Tile";
import { Generator } from "@/lib/generator/generator";
import { Grid as SquareGrid } from "@/lib/solver/square/Grid";
import { Grid as HexGrid } from "@/lib/solver/hex/Grid";
import * as sq from "@/lib/solver/square/tiles";
import * as hex from "@/lib/solver/hex/tiles";

const board = shallowReactive<BoardData>({
  type: "square",
  tiles: [],
  width: 0,
  height: 0,
});

const loadBoard = (name: keyof typeof boards) => {
  Object.assign(board, boards[name]());
};

function setTile(index: number, tile: Tile) {
  const { tiles } = board;
  tiles[index] = tile;
  board.tiles = [...tiles];
}

function makeGrid() {
  return new {
    square: SquareGrid,
    hex: HexGrid,
  }[board.type]();
}

function generateBoard() {
  const grid = makeGrid();
  const tiles = {
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

export function useBoard() {
  return {
    board,
    loadBoard,
    generateBoard,
    scrambleBoard,
    setTile,
  };
}
