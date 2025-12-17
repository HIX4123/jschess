import Long from "./Long.js";
import Square from "./Square.js";

export default class Bitboard {

  constructor(value) {
    this.value = value
  }

  static empty = new Long(0x0000000000000000n)
  static all = new Long(0xffffffffffffffffn)
  static center = new Long(0x0000001818000000n)

  static firstRank = new Long(0x00000000000000ffn)
  static lastRank = new Long(0xff00000000000000n)

  static lightSquares = new Long(0x55aa55aa55aa55aan)
  static darkSquares = new Long(0xaa55aa55aa55aa55n)

  contains(square) { return (this.value & (1n << Square.value(square))) != 0n}
  get count() { return Long.bitCount(this.value) }
}
