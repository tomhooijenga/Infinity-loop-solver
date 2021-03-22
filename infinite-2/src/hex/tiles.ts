import {Tile} from "../base/Tile";

export const Line = Tile.fromSides([true, false, false, true, false, false], 'Line')
export const TurnL = Tile.fromSides([true, false, true, false, false, false], 'Turn L');
export const End = Tile.fromSides([true, false, false, false, false, false], 'Turn L');