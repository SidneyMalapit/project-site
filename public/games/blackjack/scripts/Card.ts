enum Rank { 
  Ace = 1, 
  Two, 
  Three, 
  Four, 
  Five, 
  Six, 
  Seven, 
  Eight, 
  Nine, 
  Ten, 
  Jack, 
  Queen, 
  King 
}

enum Suit {
  Spade = 0x2660,
  Heart,
  Diamond,
  Club
}

export { Rank as CardRank, Suit as CardSuit };

export default class Card {
  constructor(public readonly rank: Rank, public readonly suit: Suit) {}
  toString(condensed = false) {
    const rank = this.rank === 1 || this.rank > 10 ? Rank[this.rank][0] : this.rank;
    const suit = String.fromCodePoint(this.suit);
    return condensed ? rank + suit : `${Rank[this.rank]} of ${Suit[this.suit]}s`;
  }
}
