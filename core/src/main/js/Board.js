// Chess board representation

class Board {
    constructor(occupied, byColor, byRole) {
        this.occupied = occupied
        this.byColor = byColor
        this.byRole = byRole
    }

    nbPieces = this.occupied.count
}