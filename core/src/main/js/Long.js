class Long {
    constructor(long) {
        this.upper = Number((long >> 32) & 0xFFFFFFFFn)
        this.lower = Number(long & 0xFFFFFFFFn)
    }

    static popCount(a) {
        return this.popCount(a.upper) + this.popCount(a.lower)
    }

    static popCount32(a) {
        a = a - (a >>> 1 & 0x55555555)
        a = (a & 0x33333333) + (a >>> 2 & 0x33333333)
        a = (a + (a >>> 4)) & 0x0F0F0F0F
        a = a + (a >>> 8)
        a = a + (a >>> 16)
        return a & 0x3F
    }
    
}