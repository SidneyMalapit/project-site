import Card, { CardSuit, CardRank } from './Card.js';

export default class Deck extends Array<Card> {
  // constructor implementation for debugging purposes
  constructor() { super(); }

  shuffle() {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
  }

  toArray(): readonly Card[] { return Array.from(this); }

  draw(cards = 1) { return this.splice(0, cards); }

  add(...cards: Card[]) { this.push(...cards); }

  get value() {
    let value = 0;
    for (const card of this) {
      value += card.rank > CardRank.Ten ? 10 : card.rank;
    }
    if (value <= 11 && this.some(card => card.rank === CardRank.Ace)) {
      value += 10;
    }
    return value;
  }

  static get standard() {
    const deck = new Deck();
    for (let i = 0; i < 52; i++) {
      deck.add(new Card(i % 13 + CardRank.Ace, Math.floor(i / 13) + CardSuit.Spade));
    }
    return deck;
  }
}
