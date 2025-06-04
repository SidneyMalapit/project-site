import Deck from './Deck.js';
import Player from './Player.js';

export default class PokerGame {
  deck = Deck.standard;

  constructor() {
    this.deck.shuffle();
  }

  *run() {
  }
}
