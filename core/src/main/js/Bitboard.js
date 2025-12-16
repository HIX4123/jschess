import Long from "./Long.js";
import Square from "./Square.js";

const Bitboard = {
  empty: new Long(0x0000000000000000n),
  all: new Long(0xffffffffffffffffn),
  center: new Long(0x0000001818000000n),

  firstRank: new Long(0x00000000000000ffn),
  lastRank: new Long(0xff00000000000000n),

  lightSquares: new Long(0x55aa55aa55aa55aan),
  darkSquares: new Long(0xaa55aa55aa55aa55n),

  contains: (a, square) => (a & (1n << Square.value(square))) != 0n,
  count: (a) => Long.bitCount(a),
};

export default Bitboard
