export default class ByColor {
    constructor(white, black) {
        this.white = white
        this.black = black
    }

    get(color) { console.log(color.white); return color.white ? this.white : this.black }
}