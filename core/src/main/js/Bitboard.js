Bitboard = {
  empty:          Long(0x0000000000000000n),
  all:            Long(0xFFFFFFFFFFFFFFFFn),
  center:         Long(0x0000001818000000n),

  firstRank:      Long(0x00000000000000FFn),
  lastRank:       Long(0xFF00000000000000n),

  lightSquares:   Long(0x55AA55AA55AA55AAn),
  darkSquares:    Long(0xAA55AA55AA55AA55n),

  count: Long.bitCount(a)
}