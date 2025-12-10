class Bitboard {
  constructor(value = 0n) {
    this.low  = Number(value & 0xFFFFFFFFn)
    this.high = Number((value >> 32n) & 0xFFFFFFFFn)
    
    this.value = (BigInt(hi) << 32n) | BigInt(lo)
  }

  static empty  = new Bitboard(0x0000000000000000n);
  static all    = new Bitboard(0xFFFFFFFFFFFFFFFFn);
  static center = new Bitboard(0x0000001818000000n);

  static firstRank  = new Bitboard(0x00000000000000ffn);
  static lastRank   = new Bitboard(0xff00000000000000n);

  static lightSquares   = new Bitboard(0x55aa55aa55aa55aan);
  static darkSquares    = new Bitboard(0xaa55aa55aa55aa55n);

  // 외부 의존성 (프로젝트 쪽 정의가 존재하면 그걸 사용하세요)
  static setExternalDeps(deps) {
    // deps: { Square, FILES, RANKS, RAYS, BETWEEN, File, Rank }
    Bitboard.Square = deps.Square ?? _fallback.Square;
    Bitboard.FILES = deps.FILES ?? _fallback.FILES;
    Bitboard.RANKS = deps.RANKS ?? _fallback.RANKS;
    Bitboard.RAYS = deps.RAYS ?? _fallback.RAYS;
    Bitboard.BETWEEN = deps.BETWEEN ?? _fallback.BETWEEN;
    Bitboard.File = deps.File ?? _fallback.File;
    Bitboard.Rank = deps.Rank ?? _fallback.Rank;
  }

  // 기본은 폴백 사용 (프로젝트에서 호출하면 실제 구현으로 덮어쓰기 가능)
  static Square = _fallback.Square;
  static FILES = _fallback.FILES;
  static RANKS = _fallback.RANKS;
  static RAYS = _fallback.RAYS;
  static BETWEEN = _fallback.BETWEEN;
  static File = _fallback.File;
  static Rank = _fallback.Rank;

  // 생성 헬퍼: 숫자 또는 Square 배열 / iterable
  static fromNumber(x) { return new Bitboard(BigInt(x)); }
  static fromSquares(iterable) {
    let v = 0n;
    for (const s of iterable) {
      // s either has .bl (BigInt) or is numeric index
      if (s && typeof s.bl === 'bigint') v |= s.bl;
      else v |= (1n << BigInt(s));
    }
    return new Bitboard(v);
  }

  // ---------- low-level helpers ----------
  toBigInt() { return Bitboard._to64(this.v); }
  valueOf() { return this.toBigInt(); } // convenience
  toString() { return "0x" + this.v.toString(16).padStart(16, '0'); }

  // bit ops (returns Bitboard)
  not() { return new Bitboard((~this.v) & MASK64); }
  and(o) {
    const ov = (o instanceof Bitboard) ? o.v : BigInt(o);
    return new Bitboard(this.v & ov);
  }
  or(o) {
    const ov = (o instanceof Bitboard) ? o.v : BigInt(o);
    return new Bitboard(this.v | ov);
  }
  xor(o) {
    const ov = (o instanceof Bitboard) ? o.v : BigInt(o);
    return new Bitboard(this.v ^ ov);
  }
  shl(n) { return new Bitboard(Bitboard._to64(this.v << BigInt(n))); } // <<
  shr(n) { return new Bitboard(this.v >> BigInt(n)); } // logical ok because v is non-negative
  // unsigned right shift equivalent (kept for API parity)
  ushr(n) { return new Bitboard((this.v >> BigInt(n)) & MASK64); }

  // predicates
  get isEmpty() { return this.v === 0n; }
  get nonEmpty() { return this.v !== 0n; }

  supersetOf(o) {
    const ov = (o instanceof Bitboard) ? o.v : BigInt(o);
    return (this.v & ov) === ov;
  }
  subsetOf(o) {
    const ov = (o instanceof Bitboard) ? o.v : BigInt(o);
    return (this.v & ov) === this.v;
  }

  containsSquare(square) {
    // square: object with .value or .bl, or numeric index
    if (square && typeof square.bl === 'bigint') {
      return (this.v & square.bl) !== 0n;
    } else if (typeof square === 'number') {
      return (this.v & (1n << BigInt(square))) !== 0n;
    } else if (square && typeof square.value === 'number') {
      return (this.v & (1n << BigInt(square.value))) !== 0n;
    }
    return false;
  }

  containsFileRank(file, rank) {
    // file.bb and rank.bb expected BigInt masks
    return (this.v & file.bb & rank.bb) !== 0n;
  }

  add(square) {
    const bl = (square && typeof square.bl === 'bigint') ? square.bl : (1n << BigInt(square));
    return new Bitboard(this.v | bl);
  }
  remove(square) {
    const bl = (square && typeof square.bl === 'bigint') ? square.bl : (1n << BigInt(square));
    return new Bitboard(this.v & (~bl & MASK64));
  }

  move(fromSquare, toSquare) {
    const fromBl = (fromSquare && typeof fromSquare.bl === 'bigint') ? fromSquare.bl : (1n << BigInt(fromSquare));
    const toBl = (toSquare && typeof toSquare.bl === 'bigint') ? toSquare.bl : (1n << BigInt(toSquare));
    return new Bitboard((this.v & (~fromBl & MASK64)) | toBl);
  }

  moreThanOne() {
    return (this.v & (this.v - 1n)) !== 0n;
  }

  // popcount
  count() {
    let b = this.v;
    let cnt = 0;
    while (b !== 0n) {
      b &= (b - 1n);
      cnt++;
    }
    return cnt;
  }

  // trailing zeros -> least significant set bit index (0..63) or null if none
  trailingZeros() {
    if (this.v === 0n) return null;
    let b = this.v;
    let idx = 0;
    while ((b & 1n) === 0n) {
      b >>= 1n;
      idx++;
    }
    return idx;
  }

  // leading zeros / msb index (63 - numberOfLeadingZeros)
  msbIndex() {
    if (this.v === 0n) return null;
    let idx = 0;
    let b = this.v;
    while (b >>= 1n) idx++;
    return idx;
  }

  // first/last as index or null
  firstIndex() { return this.trailingZeros(); }
  lastIndex() { return this.msbIndex(); }

  // singleSquare: returns index if exactly one bit, else null
  singleSquare() {
    if (this.moreThanOne()) return null;
    return this.firstIndex();
  }

  // remove first (lsb)
  removeFirst() {
    return new Bitboard(this.v & (this.v - 1n));
  }
  // remove last (msb)
  removeLast() {
    const li = this.msbIndex();
    if (li === null) return Bitboard.empty;
    const mask = ~(1n << BigInt(li)) & MASK64;
    return new Bitboard(this.v & mask);
  }

  isolateFirst() {
    // a & -a
    const isolated = this.v & ((-this.v) & MASK64);
    return new Bitboard(isolated);
  }

  isolateLast() {
    const li = this.msbIndex();
    if (li === null) return Bitboard.empty;
    return new Bitboard((1n << BigInt(li)) & MASK64);
  }

  intersects(o) {
    const ov = (o instanceof Bitboard) ? o.v : BigInt(o);
    return (this.v & ov) !== 0n;
  }
  isDisjoint(o) {
    const ov = (o instanceof Bitboard) ? o.v : BigInt(o);
    return (this.v & ov) === 0n;
  }

  // squares ascending order -> returns array of indices or Square objects if Square provided by external deps?
  squares(asSquareObjects = false) {
    const res = [];
    let b = this.v;
    while (b !== 0n) {
      const lsb = b & ((-b) & MASK64);
      // index of lsb
      let idx = 0;
      let temp = lsb;
      while ((temp >> 1n) !== 0n) { temp >>= 1n; idx++; }
      // above loop computes index, but careful when lsb == 1n -> idx 0; check:
      // more robust: use trailingZeros on (new Bitboard(lsb))
      idx = new Bitboard(lsb).trailingZeros();
      res.push(asSquareObjects ? Bitboard.Square.unsafe(idx) : idx);
      b &= (b - 1n);
    }
    return res;
  }

  // toSet returns a JS Set of indices or Square objects
  toSet(asSquareObjects = false) {
    return new Set(this.squares(asSquareObjects));
  }

  // first / last with function f: apply f to squares until Option-like value returned
  // In JS we treat f as function(idx) => value or null/undefined; returns first non-null
  firstResult(f) {
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      const r = f(Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx);
      if (r !== null && r !== undefined) return r;
      b &= (b - 1n);
    }
    return null;
  }

  lastResult(f) {
    let b = this.v;
    while (b !== 0n) {
      const li = new Bitboard(b).msbIndex();
      const r = f(Bitboard.Square ? Bitboard.Square.unsafe(li) : li);
      if (r !== null && r !== undefined) return r;
      // remove msb
      b &= ~(1n << BigInt(li)) & MASK64;
    }
    return null;
  }

  find(f) {
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      if (f(Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx)) return Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx;
      b &= (b - 1n);
    }
    return null;
  }

  findLast(f) {
    let b = this.v;
    while (b !== 0n) {
      const li = new Bitboard(b).msbIndex();
      if (f(Bitboard.Square ? Bitboard.Square.unsafe(li) : li)) return Bitboard.Square ? Bitboard.Square.unsafe(li) : li;
      b &= ~(1n << BigInt(li)) & MASK64;
    }
    return null;
  }

  fold(init, f) {
    let b = this.v;
    let acc = init;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      acc = f(acc, Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx);
      b &= (b - 1n);
    }
    return acc;
  }

  filter(f) {
    const res = [];
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      const s = Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx;
      if (f(s)) res.push(s);
      b &= (b - 1n);
    }
    return res;
  }

  withFilter(f) { return this.filter(f); }

  foreach(f) {
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      f(Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx);
      b &= (b - 1n);
    }
  }

  forall(f) {
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      if (!f(Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx)) return false;
      b &= (b - 1n);
    }
    return true;
  }

  exists(f) {
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      if (f(Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx)) return true;
      b &= (b - 1n);
    }
    return false;
  }

  flatMap(f) {
    const res = [];
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      const xs = f(Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx);
      for (const x of xs) res.push(x);
      b &= (b - 1n);
    }
    return res;
  }

  map(f) {
    const res = [];
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      res.push(f(Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx));
      b &= (b - 1n);
    }
    return res;
  }

  // iterator (generator)
  *[Symbol.iterator]() {
    let b = this.v;
    while (b !== 0n) {
      const idx = new Bitboard(b & ((-b) & MASK64)).trailingZeros();
      yield Bitboard.Square ? Bitboard.Square.unsafe(idx) : idx;
      b &= (b - 1n);
    }
  }

  // debug: prints board rows like Scala version
  debug() {
    const builder = [];
    for (const r of Bitboard.Rank.allReversed) {
      for (const f of Bitboard.File.all) {
        const sIdx = f.value + 8 * r.value;
        const contains = this.containsSquare({ value: sIdx });
        builder.push(contains ? "1" : ".");
        if (f.value !== Bitboard.File.H.value) builder.push(" ");
        else if (sIdx !== 63) builder.push("\n");
      }
    }
    return builder.join('');
  }

  // convenience: aligned/ray/between delegates to external precomputed arrays if present
  static file(f) { return new Bitboard(Bitboard.FILES[f.value]); }
  static rank(r) { return new Bitboard(Bitboard.RANKS[r.value]); }
  static ray(from, to) {
    return new Bitboard(Bitboard.RAYS[from.value] ? Bitboard.RAYS[from.value][to.value] : 0n);
  }
  static between(a, b) {
    return new Bitboard(Bitboard.BETWEEN[a.value] ? Bitboard.BETWEEN[a.value][b.value] : 0n);
  }
  static aligned(a, b, c) {
    const ray = Bitboard.ray(a, b);
    return ray.containsSquare(c);
  }
}

///// 기본 외부 의존성으로 덮어쓰기 (옵션)
Bitboard.setExternalDeps({
  Square: _fallback.Square,
  FILES: _fallback.FILES,
  RANKS: _fallback.RANKS,
  RAYS: _fallback.RAYS,
  BETWEEN: _fallback.BETWEEN,
  File: _fallback.File,
  Rank: _fallback.Rank
});

export default Bitboard;
export { Bitboard, MASK64 };
