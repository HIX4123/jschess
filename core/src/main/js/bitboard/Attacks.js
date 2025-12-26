import Magic from "./Magic.js";

export default class Attacks {
  constructor() {
    void this.#initialize();
  }
  static all = 0xffffffffffffffffn;

  static RANKS = new BigUint64Array(8);
  static FILES = new BigUint64Array(8);
  static BETWEEN = Array.from({ length: 64 }, () => new BigUint64Array(64));
  static RAYS = Array.from({ length: 64 }, () => new BigUint64Array(64));

  static ATTACKS = new BigUint64Array(88772);

  static KNIGHT_ATTACKS = new BigUint64Array(64);
  static KING_ATTACKS = new BigUint64Array(64);
  static WHITE_PAWN_ATTACKS = new BigUint64Array(64);
  static BLACK_PAWN_ATTACKS = new BigUint64Array(64);

  static #KNIGHT_DELTAS = [17, 15, 10, 6, -17, -15, -10, -6];
  static #BISHOP_DELTAS = [7, -7, 9, -9];
  static #ROOK_DELTAS = [1, -1, 8, -8];
  static #KING_DELTAS = [1, 7, 8, 9, -1, -7, -8, -9];
  static #WHITE_PAWN_DELTAS = [7, 9];
  static #BLACK_PAWN_DELTAS = [-7, -9];

  #slidingAttacks(square, occupied, deltas) {
    let attacks = 0n;
    for (const delta of deltas) {
      let sq = square;
      while (true) {
        sq += delta;
        const outOfBoard = sq < 0 || 64 <= sq;
        const wrapped = this.#distance(sq, sq - delta) > 2;
        if (!outOfBoard && !wrapped) {
          attacks |= 1n << BigInt(sq);
        }
        if (this.#contains(occupied, sq) || outOfBoard || wrapped) {
          break;
        }
      }
    }
    return attacks;
  }

  #initMagics(square, magic, shift, deltas) {
    let subset = 0n;
    while (true) {
      let attack = this.#slidingAttacks(square, subset, deltas);
      let idx = ((magic.factor * subset) >> BigInt(64 - shift)) + BigInt(magic.offset);
      Attacks.ATTACKS[idx] = attack;

      subset = (subset - magic.mask) & magic.mask;

      if (subset == 0n) {
        break;
      }
    }
  }

  #initialize() {
    for (let i = 0; i < 8; i++) {
      Attacks.RANKS[i] = 0xffn << BigInt(i * 8);
      Attacks.FILES[i] = 0x0101010101010101n << BigInt(i);
    }

    let squareRange = this.#until(0, 64);
    for (const sq of squareRange) {
      Attacks.KNIGHT_ATTACKS[sq] = this.#slidingAttacks(sq, Attacks.all, Attacks.#KNIGHT_DELTAS);
      Attacks.KING_ATTACKS[sq] = this.#slidingAttacks(sq, Attacks.all, Attacks.#KING_DELTAS);
      Attacks.WHITE_PAWN_ATTACKS[sq] = this.#slidingAttacks(
        sq,
        Attacks.all,
        Attacks.#WHITE_PAWN_DELTAS,
      );
      Attacks.BLACK_PAWN_ATTACKS[sq] = this.#slidingAttacks(
        sq,
        Attacks.all,
        Attacks.#BLACK_PAWN_DELTAS,
      );

      this.#initMagics(sq, Magic.ROOK[sq], 12, Attacks.#ROOK_DELTAS);
      this.#initMagics(sq, Magic.BISHOP[sq], 9, Attacks.#BISHOP_DELTAS);
    }

    for (const a of squareRange) {
      for (const b of squareRange) {
        if (this.#contains(this.#slidingAttacks(a, 0n, Attacks.#ROOK_DELTAS), b)) {
          Attacks.BETWEEN[a][b] =
            this.#slidingAttacks(a, 1n << BigInt(b), Attacks.#ROOK_DELTAS) &
            this.#slidingAttacks(b, 1n << BigInt(a), Attacks.#ROOK_DELTAS);
          Attacks.RAYS[a][b] =
            (1n << BigInt(a)) |
            (1n << BigInt(b)) |
            (this.#slidingAttacks(a, 0n, Attacks.#ROOK_DELTAS) &
              this.#slidingAttacks(b, 0n, Attacks.#ROOK_DELTAS));
        } else if (this.#contains(this.#slidingAttacks(a, 0n, Attacks.#BISHOP_DELTAS), b)) {
          Attacks.BETWEEN[a][b] =
            this.#slidingAttacks(a, 1n << BigInt(b), Attacks.#BISHOP_DELTAS) &
            this.#slidingAttacks(b, 1n << BigInt(a), Attacks.#BISHOP_DELTAS);
          Attacks.RAYS[a][b] =
            (1n << BigInt(a)) |
            (1n << BigInt(b)) |
            (this.#slidingAttacks(a, 0n, Attacks.#BISHOP_DELTAS) &
              this.#slidingAttacks(b, 0n, Attacks.#BISHOP_DELTAS));
        }
      }
    }
  }

  #contains(l, s) {
    return (l & (1n << BigInt(s))) != 0n;
  }

  #distance(a, b) {
    function file(s) {
      return s & 7;
    }
    function rank(s) {
      return s >>> 3;
    }
    return Math.max(Math.abs(file(a) - file(b)), Math.abs(rank(a) - rank(b)));
  }

  #until(a, b) {
    const arr = new Array(b - a);
    for (let i = a; i < b; i++) {
      arr[i - a] = i;
    }
    return arr;
  }
}
