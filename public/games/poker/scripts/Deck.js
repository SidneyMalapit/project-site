"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const Card_js_1 = __importStar(require("./Card.js"));
class Deck extends Array {
    // constructor implementation for debugging purposes
    constructor() {
        super();
        this.it = 0;
    }
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
    get iterator() { return this.it; }
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
    toArray() {
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
    add(...cards) { this.push(...cards); }
    /**
     * Creates a standard deck of 52 playing cards.
     */
    static get standard() {
        const deck = new Deck();
        for (let i = 0; i < 52; i++) {
            deck.add(new Card_js_1.default(i % 13 + Card_js_1.CardRank.Ace, Math.floor(i / 13) + Card_js_1.CardSuit.Spade));
        }
        return deck;
    }
}
exports.default = Deck;
