import Bitboard from "./Bitboard.js";
import Board from "./Board.js";
import ByColor from "./ByColor.js";
import ByRole from "./ByRole.js";
import Color from "./Color.js";
import * as Role from "./Role.js";
import Square from "./Square.js";

let test = new Board(
    new Bitboard(0xffff00000000ffffn),
    new ByColor(
        new Bitboard(0x000000000000ffffn),
        new Bitboard(0xffff000000000000n)
    ),
    new ByRole(
        new Bitboard(0x00ff00000000ff00n),
        new Bitboard(0x4200000000000042n),
        new Bitboard(0x2400000000000024n),
        new Bitboard(0x8100000000000081n),
        new Bitboard(0x0800000000000008n),
        new Bitboard(0x1000000000000010n)
    )
);

// Color 클래스 기능 작동 확인
console.log("test.nbPieces:", test.nbPieces);
console.log("test.isOccupied(new Square(32)):", test.isOccupied(new Square(32)));
console.log("test.contains(Color.White, Role.Rook):", test.contains(Color.White, Role.Rook));
