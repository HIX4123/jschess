export default class Role {

    constructor(forsyth) {
        this.forsyth = forsyth;
    }
    get forsythUpper() { return this.forsyth.toUpperCase(); }


}

class PromotableRole extends Role { constructor(forsyth) { super(forsyth); } }

export const King = new Role('k');
export const Queen = new PromotableRole('q');
export const Rook = new PromotableRole('r');
export const Bishop = new PromotableRole('b');
export const Knight = new PromotableRole('n');
export const Pawn = new Role('p');

Object.freeze({ King, Queen, Rook, Bishop, Knight, Pawn})