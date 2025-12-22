export default class Rank {
    constructor(value) {
        this.value = value;
    }

    get char() { return String.fromCharCode(49 + this.value)}

    static of(square) {
        return new Rank(square.value >> 3);
    }
}