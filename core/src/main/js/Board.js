import Bitboard from "./Bitboard.js"

// Chess board representation

export default class Board {
    constructor(occupied, byColor, byRole) {
        this.occupied = occupied
        this.byColor = byColor
        this.byRole = byRole
    }
    
    get nbPieces() {
        return Bitboard.count(this.occupied)
    }

    isOccupied(s) {
        return Bitboard.contains(this.occupied, s)
    }

    contains(...args) {
        if (args.length == 1) {
            let [p] = args;
            return this.piece(p).length > 0;
        } else if (args.length == 2) {
            let [color, role] = args
            return this.piece(color, role).length > 0
        }
    }

    piece(...args) {
        if (args.length == 1) {
            let [p] = args
            return this.piece()
        }
    }
}