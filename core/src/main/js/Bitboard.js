import Long from "./Long.js";
import Square from "./Square.js";

export default class Bitboard {

  constructor(value) {
    this.value = value;
  }

  get nonEmpty() {
    return this.value.nonEmpty
  }

  static empty = new Bitboard(0x0000000000000000n);
  static all = new Bitboard(0xffffffffffffffffn);
  static center = new Bitboard(0x0000001818000000n);

  static firstRank = new Bitboard(0x00000000000000ffn);
  static lastRank = new Bitboard(0xff0000000000ffffn);

  static lightSquares = new Bitboard(0x55aa55aa55aa55aan);
  static darkSquares = new Bitboard(0xaa55aa55aa55aa55n);

  and(o) { return new Bitboard(this.value.and(o.value)); }

  contains(square) { return (this.value & (1n << Square.value(square))) != 0n; }
  get count() { return Long.bitCount(this.value); }
}
