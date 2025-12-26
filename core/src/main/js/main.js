import Attacks from './bitboard/Attacks.js';

new Attacks();

const formatted = (field) => [...Attacks[field]].map((b) => '0x' + b.toString(16).padStart(16, '0'));

console.log(`RANKS:\n${formatted('RANKS').join(',\n')}`);
console.log(`FILES:\n${formatted('FILES').join(',\n')}`);
console.log(`BETWEEN:\n${formatted('BETWEEN').join(',\n')}`);