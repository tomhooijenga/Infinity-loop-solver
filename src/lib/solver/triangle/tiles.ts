import { Tile } from "@/lib/base/Tile";

export const End = Tile.fromSides([true, false, false], "End");
export const Turn = Tile.fromSides([true, true, false], "Turn");
export const Triangle = Tile.fromSides([true, true, true], "Triangle");