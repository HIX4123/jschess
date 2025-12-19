// Chess board representation

export default class Board {
    constructor(occupied, byColor, byRole) {
        this.occupied = occupied
        this.byColor = byColor
        this.byRole = byRole
    }
    
    get nbPieces() {
        return this.occupied.count
    }

    isOccupied(s) {
        return this.occupied.contains(s)
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
            return this.piece(p.color, p.role)
        } else if (args.length == 2) {
            let [color, role] = args
            console.log(color, role.forsyth)
            console.log(this.byColor.get(color), this.byRole.get(role))
            return this.byColor.get(color) & this.byRole.get(role)
        }
    }
}