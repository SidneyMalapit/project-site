import { default as Hand } from './PokerHand.js';

export default class Player {
  balance: number;
  hand: Hand;

  constructor(hand: Hand, balance = 0) {
    this.balance = balance;
  }
}
