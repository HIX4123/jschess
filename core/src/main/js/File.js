export default class File {
    constructor(value) {
        this.value = value;
    }

    get char() { return String.fromCharCode(97 + this.value)}

    static of(square) {
        return new File(square.value & 0x7);
    }
}