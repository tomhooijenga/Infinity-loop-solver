import {FitSolver} from "./base/solvers/FitSolver";
import {DirectionUtil} from "./base/DirectionUtil";
import {NoneSolver} from "./base/solvers/NoneSolver";
import {AllSidesSolver} from "./base/solvers/AllSidesSolver";
import {TurnL} from './hex/tiles'
import {Board} from "./hex/Board";
import {None} from "./base/None";

// 6x4
// const tiles = [
//     None, Turn, Turn, Turn, Turn, None, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, Turn, None, Turn, Turn, Turn, Turn, None
// ].map((tile, index) => new tile({x: index % 6, y: Math.floor(index / 6)}));

// const tiles = [
//     None, Turn, Line, End, End, Line, Turn, None, End, Turn, End, Turn, Turn, End, Turn, End, Turn, Line, Junction, Cross, Cross, Junction, Line, Turn, Line, End, Cross, Junction, Junction, Cross, End, Line, Junction, End, Junction, Cross, Cross, Junction, End, Junction, Line, Turn, Turn, Junction, Junction, Turn, Turn, Line, Turn, Cross, Turn, End, End, Turn, Cross, Turn, None, End, End, End, End, End, End, None
// ].map((tile, index) => new tile({x: index % 8, y: Math.floor(index / 8)}))

// const tiles = [
//     End, Line, End
// ].map((tile, index) => new tile({x: index % 3, y: Math.floor(index / 3)}))

// const tiles = [
//     new End({x: 0, y: 0}),
//     new Line({x: 1, y: 0}),
//     new End({x: 2, y: 0}),
// ]

const middle =     new None({x: 1, y: 1});

// Even-r
const tiles = [
    new TurnL({x: 0, y: 0}),
    new TurnL({x: 1, y: 0}),
    new TurnL({x: 2, y: 1}),
    new TurnL({x: 1, y: 2}),
    new TurnL({x: 0, y: 2}),
    new TurnL({x: 0, y: 1}),
    middle,
]

const board = new Board(tiles)

DirectionUtil.NUM_SIDES = 6;

board.solve([
    new NoneSolver(board),
    new AllSidesSolver(board),
])

console.log(board.solve([
    // new LineSolver(board),
    // new TurnSolver(board),
    new FitSolver(board),
]));

console.log(board.tiles)