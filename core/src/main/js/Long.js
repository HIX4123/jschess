export default class Long {
    constructor(long) {
        this.upper = Number((long >> 32n) & 0xFFFFFFFFn);
        this.lower = Number(long & 0xFFFFFFFFn);

    }

    get value() {
        return (BigInt(this.upper) << 32n) | BigInt(this.lower);
    }

    get nonEmpty() {
        return this.upper != 0 || this.lower != 0;
    }

    and(o) {
        return (BigInt(this.upper & o.upper) << 32n) | BigInt(this.lower & o.lower);
    }

    static bitCount(a) {
        a = new Long(a);
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