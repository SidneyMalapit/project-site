"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Deck_js_1 = __importDefault(require("./Deck.js"));
class PokerGame {
    constructor() {
        this.deck = Deck_js_1.default.standard;
        this.deck.shuffle();
    }
    *run() {
    }
}
exports.default = PokerGame;
