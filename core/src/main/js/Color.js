export default class Color {
    constructor(name, letter) {
        this.name = name;
        this.letter = letter;
    }
    static White = new Color("white", "w");
    static Black = new Color("black", "b");


    get white() { return this === Color.White; }
    get black() { return this === Color.Black; }

    fold(w, b) { return this.white ? w : b; }

    get negate() { return this.fold(Color.Black, Color.White); }

}

Object.freeze(Color)