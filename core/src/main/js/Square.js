import Bitboard from './Bitboard.js';
import File from './File.js';
import Rank from './Rank.js';

export default class Square {
    constructor(...args) {
        if (args.length == 1) {
            let [value] = args;
            this.value = value;
        } else if (args.length == 2) {
            let [file, rank] = args;
            this.value = rank.value * 8 + file.value;
        }
    }

    prevRank(color) {
        return Square.at(this.file.value, this.rank.value + color.fold(-1, 1));
    }
    nextRank(color) {
        return Square.at(this.file.value, this.rank.value + color.fold(1, -1));
    }

    onLeftOf(other) {
        return this.file.value < other.file.value;
    }
    onRightOf(other) {
        return this.file.value > other.file.value;
    }
    belowOf(other) {
        return this.rank.value < other.rank.value;
    }
    aboveOf(other) {
        return this.rank.value > other.rank.value;
    }

    onSameFile(other) {
        return this.file.value === other.file.value;
    }
    onSameRank(other) {
        return this.rank.value === other.rank.value;
    }
    onSameLine(other) {
        return this.onSameFile(other) || this.onSameRank(other);
    }
    onSameDiagonal(other) {
        return this.file.value - this.rank.value === other.file.value - other.rank.value || this.file.value + this.rank.value === other.file.value + other.rank.value;
    }

    xDist(other) {
        return Math.abs(this.file.value - other.file.value);
    }
    yDist(other) {
        return Math.abs(this.rank.value - other.rank.value);
    }

    get isLight() {
        return Bitboard.lightSquares.contains(this);
    }

    get file() {
        return File.of(this);
    }
    get rank() {
        return Rank.of(this);
    }

    get asChar() {
        if (this.value <= 25) {
            return String.fromCharCode(97 + this.value);
        } else if (this.value <= 51) {
            return String.fromCharCode(39 + this.value);
        } else if (this.value <= 61) {
            return String.fromCharCode(this.value - 4);
        } else if (this.value == 62) {
            return '!';
        } else {
            return '"';
        }
    }

    get key() {
        return `${this.file.char}${this.rank.char}`;
    }

    withRank(r) { return new Square(this.file, r); }
    withFile(f) { return new Square(f, this.rank); }

    withRankOf(o) { return this.withRank(o.rank); }
    withFileOf(o) { return this.withFile(o.file); }

    get bb() { return new Bitboard(1n << BigInt(this.value)); }
    get bl() { return 1n << BigInt(this.value); }

    bishopAttacks(occupied) {
        return new Bitboard(ATTACKS(Magic.BISHOP(this.value).bishopIndex(occupied.value)))
    }

    static at(x, y) {
        return (0 <= x && x < 8 && 0 <= y && y < 8)
            ? new Square(y * 8 + x)
            : null;
    }
}