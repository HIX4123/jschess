import Long from "./Long.js";
import Square from "./Square.js";

export default class Bitboard {

  constructor(...args) {
    if (args.length == 1) {
      let [long] = args
      this.upper = Number((long >> 32n) & 0xFFFFFFFFn);
      this.lower = Number(long & 0xFFFFFFFFn);
    } else if (args.length == 2) {
      let [upper, lower] = args
      this.upper = upper
      this.lower = lower
    }
  }

  get nonEmpty() {
    return !(this.upper == 0 && this.lower == 0);
  }

  static empty = new Bitboard(0x0000000000000000n);
  static all = new Bitboard(0xffffffffffffffffn);
  static center = new Bitboard(0x0000001818000000n);

  static firstRank = new Bitboard(0x00000000000000ffn);
  static lastRank = new Bitboard(0xff0000000000ffffn);

  static lightSquares = new Bitboard(0x55aa55aa55aa55aan);
  static darkSquares = new Bitboard(0xaa55aa55aa55aa55n);

  and(o) { return new Bitboard(this.upper & o.upper, this.lower & o.lower); }

  contains(square) {
    return square.value >= 32
      ? (this.upper & (1 << (square.value - 32))) != 0
      : (this.lower & (1 << square.value)) != 0;
  }
  get count() { return Long.bitCount(this); }

  toBitString() {
    const hi = this.upper.toString(2).padStart(32, '0');
    const lo = this.lower.toString(2).padStart(32, '0');
    return hi + lo; // length = 64
  }
  toString() {
    const bits = this.toBitString();
    let out = '';

    for (let rank = 7; rank >= 0; rank--) {
      const start = rank * 8;
      const row = bits.slice(start, start + 8);
      out += row + '\n';
    }

    return out.trimEnd();
  }

}
