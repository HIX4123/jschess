export default class Role {

    get forsythUpper() { return this.forsyth.toUpperCase(); }
    

}

class PromotableRole extends Role { }

export class King extends PromotableRole {
    constructor() {
        this.forsyth = 'k'
    }
}

export class Queen extends PromotableRole {
    constructor() {
        this.forsyth = 'q'
    }
}

export class Rook extends PromotableRole {
    constructor() {
        this.forsyth = 'r'
    }
}

export class Bishop extends PromotableRole {
    constructor() {
        this.forsyth = 'b'
    }
}

export class Knight extends PromotableRole {
    constructor() {
        this.forsyth = 'n'
    }
}

export class Pawn extends PromotableRole {
    constructor() {
        this.forsyth = 'p'
    }
}