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
}