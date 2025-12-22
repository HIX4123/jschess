// Chess board representation

export default class Board {
    constructor(occupied, byColor, byRole) {
        this.occupied = occupied;
        this.byColor = byColor;
        this.byRole = byRole;
    }

    get white() { return this.byColor.white; }
    get black() { return this.byColor.black; }
    get pawns() { return this.byRole.pawn; }
    get knights() { return this.byRole.knight; }
    get bishops() { return this.byRole.bishop; }
    get rooks() { return this.byRole.rook; }
    get queens() { return this.byRole.queen; }
    get kings() { return this.byRole.king; }

    get nbPieces() {
        return this.occupied.count;
    }

    isOccupied(s) {
        return this.occupied.contains(s);
    }

    contains(...args) {
        if (args.length == 1) {
            let [p] = args;
            return this.piece(p).nonEmpty;
        } else if (args.length == 2) {
            let [color, role] = args;
            console.log(color, role);
            return this.piece(color, role).nonEmpty;
        }
    }

    byPiece(...args) {
        if (args.length == 1) {
            let [piece] = args;
            return this.byPiece(piece.color, piece.role);
        } else if (args.length == 2) {
            let [color, role] = args;
            return this.byColor.get(color).and(this.byRole.get(role))?? Bitboard.empty;
        }
    }

    piece(...args) {
        if (args.length == 1) {
            let [p] = args;
            return this.piece(p.color, p.role);
        } else if (args.length == 2) {
            let [color, role] = args;
            return this.byColor.get(color).and(this.byRole.get(role))?? Bitboard.empty;
        }
    }
}