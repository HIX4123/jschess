import Role from "./Role.js"

export default class ByRole {
    constructor(pawn, knight, bishop, rook, queen, king) {
        this.pawn = pawn
        this.knight = knight
        this.bishop = bishop
        this.rook = rook
        this.queen = queen
        this.king = king
    }

    get(role) {
        return {
            p: this.pawn,
            n: this.knight,
            b: this.bishop,
            r: this.rook,
            q: this.queen,
            k: this.king
        }[role.forsyth]
    }
}