export default class Attacks {

    static all = 0xFFFFFFFFFFFFFFFFn;

    static RANKS = new BigUint64Array(8);
    static FILES = new BigUint64Array(8);
    static BETWEEN = Array.from({ length: 64 }, () => new BigUint64Array(64));
    static RAYS = Array.from({ length: 64 }, () => new BigUint64Array(64));

    static ATTACKS = new BigUint64Array(88772);

    
}