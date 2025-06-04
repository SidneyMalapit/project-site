import Card, { CardSuit, CardRank } from './Card.js';

export default class Deck extends Array<Card> {
  it = 0;

  // constructor implementation for debugging purposes
  constructor() { super(); }

  /**
   * Shuffles the deck of cards.
   */
  shuffle() {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
  }

  /**
   * Returns the iterator for this deck.
   */
  get iterator(): number { return this.it; }

  /**
   * Increments this deck's iterator. If the iterator is at the end of the deck, it wraps around to the beginning.
   */
  next() { this.it = (this.it + 1) % this.length; }

  /**
   * Decrements this deck's iterator. If the iterator is at the beginning of the deck, it wraps around to the end.
   */
  prev() {
    if (this.it == 0) {
      this.it = this.length;
      return;
    }
    this.it--;
  }

  toArray(): readonly Card[] {
    const arr = Array.from(this);
    Object.freeze(arr);
    return arr;
  }

  /**
   * Draws a specified number of cards from the deck. Does not mutate the deck.
   * @param cards The number of cards to draw.
   * @returns An array of drawn cards.
   */
  draw(cards = 1) { return this.slice(0, cards); }

  add(...cards: Card[]) { this.push(...cards); }

  /**
   * Creates a standard deck of 52 playing cards.
   */
  static get standard() {
    const deck = new Deck();
    for (let i = 0; i < 52; i++) {
      deck.add(new Card(i % 13 + CardRank.Ace, Math.floor(i / 13) + CardSuit.Spade));
    }
    return deck;
  }
}
