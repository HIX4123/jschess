export default class Long {

    static contains(l, s) {
        
    }

    static bitCount(a) {
        return this.popCount32(a.upper) + this.popCount32(a.lower);
    }

    static popCount32(a) {
        a = a - (a >>> 1 & 0x55555555);
        a = (a & 0x33333333) + (a >>> 2 & 0x33333333);
        a = (a + (a >>> 4)) & 0x0F0F0F0F;
        a = a + (a >>> 8);
        a = a + (a >>> 16);
        return a & 0x3F;
    }
    
}