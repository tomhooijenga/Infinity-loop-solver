import {Tile} from "../../base/Tile";

export const Cross = Tile.fromSides([true, true, true, true], "Cross");
export const End = Tile.fromSides([true, false, false, false], "End");
export const Junction = Tile.fromSides([true, true, true, false], "Junction");
export const Line = Tile.fromSides([true, false, true, false], "Line");
export const Turn = Tile.fromSides([true, true, false, false], "Turn");