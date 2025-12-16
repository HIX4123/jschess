import Board from "./Board.js"

let test = new Board(0x800F000F000F000Fn, 0x0n, 0x0n)

console.log(test.nbPieces);
console.log(test.isOccupied(62n))