"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardSuit = exports.CardRank = void 0;
var Rank;
(function (Rank) {
    Rank[Rank["Ace"] = 1] = "Ace";
    Rank[Rank["Two"] = 2] = "Two";
    Rank[Rank["Three"] = 3] = "Three";
    Rank[Rank["Four"] = 4] = "Four";
    Rank[Rank["Five"] = 5] = "Five";
    Rank[Rank["Six"] = 6] = "Six";
    Rank[Rank["Seven"] = 7] = "Seven";
    Rank[Rank["Eight"] = 8] = "Eight";
    Rank[Rank["Nine"] = 9] = "Nine";
    Rank[Rank["Ten"] = 10] = "Ten";
    Rank[Rank["Jack"] = 11] = "Jack";
    Rank[Rank["Queen"] = 12] = "Queen";
    Rank[Rank["King"] = 13] = "King";
})(Rank || (exports.CardRank = Rank = {}));
var Suit;
(function (Suit) {
    Suit[Suit["Spade"] = 9824] = "Spade";
    Suit[Suit["Heart"] = 9825] = "Heart";
    Suit[Suit["Diamond"] = 9826] = "Diamond";
    Suit[Suit["Club"] = 9827] = "Club";
})(Suit || (exports.CardSuit = Suit = {}));
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    /**
     * Returns a string representation of the card. ex. "Ace of Spades"
     * @param condensed - If true, returns a condensed string representation. ex. "A♠"
     */
    toString(condensed = false) {
        const rank = this.rank === 1 || this.rank > 10 ? Rank[this.rank][0] : this.rank;
        const suit = String.fromCodePoint(this.suit);
        return condensed ? rank + suit : `${Rank[this.rank]} of ${Suit[this.suit]}s`;
    }
}
exports.default = Card;
