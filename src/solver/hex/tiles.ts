import {Tile} from "../base/Tile";

export const End = Tile.fromSides([true, false, false, false, false, false], 'End');
export const TurnS = Tile.fromSides([true, true, false, false, false, false], 'TurnS');
export const TurnL = Tile.fromSides([true, false, true, false, false, false], 'TurnL');
export const Line = Tile.fromSides([true, false, false, true, false, false], 'Line')
export const Junction = Tile.fromSides([true, true, true, false, false, false], 'Junction');
export const CheckL = Tile.fromSides([false, false, true, true, false, true], 'CheckL');
export const CheckR = Tile.fromSides([false, true, false, true, true, false], 'CheckR');
export const Square = Tile.fromSides([true, false, true, true, false, true], 'Square');
export const Knuckles = Tile.fromSides([true, true, true, true, false, false], 'Knuckles')
export const Triangle = Tile.fromSides([true, false, true, false, true, false], 'Triangle');
export const Diamond = Tile.fromSides([true, true, false, true, false, true], 'Diamond');
export const Star = Tile.fromSides([true, true, true, true, true, true], 'Star');