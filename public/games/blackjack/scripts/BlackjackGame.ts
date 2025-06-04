import Deck from './Deck.js';
import Card from './Card.js';

export enum BlackjackPlayerAction {
  Hit,
  Stand
}

export enum BlackjackGameActionType {
  AddPlayerCard,
  AddDealerCard,
  EndGame,
  Initialize
}

export enum BlackjackWinner {
  Player,
  Dealer,
  None
}

export const BlackjackWinnerDescriptions = {
  [BlackjackWinner.Player]: 'player wins',
  [BlackjackWinner.Dealer]: 'dealer wins',
  [BlackjackWinner.None]: 'draw'
}

export interface BlackjackGameAction {
  readonly type: BlackjackGameActionType;
  readonly cards?: readonly Card[];
  readonly winner?: BlackjackWinner;
}

export type subscriber = (action: BlackjackGameAction) => void;

export default class BlackjackGame {
  private player: Deck;
  private dealer: Deck;
  private cards: Deck;
  private actionTimeline: BlackjackGameAction[] = [];
  private subscribers: subscriber[] = [];
  private inPlay = false;

  reset() {
    this.cards = Deck.standard;
    this.cards.shuffle();

    this.player = new Deck();
    this.dealer = new Deck();
    
    this.addToTimeline({ type: BlackjackGameActionType.Initialize });

    this.inPlay = false;
  }

  // yields player's avaliable actions
  *play(): Generator<BlackjackPlayerAction[], BlackjackPlayerAction[], BlackjackPlayerAction> {
    if (this.inPlay) { throw Error('Game already in play'); }
    this.inPlay = true;

    this.addPlayerCard(...this.cards.draw(2));
    this.addDealerCard(...this.cards.draw());
    
    if (this.playerValue === 21) {
      this.endGame(BlackjackWinner.Player);
      return [];
    }

    do {
      let availableActions = [BlackjackPlayerAction.Hit, BlackjackPlayerAction.Stand];
      if ((yield availableActions) === BlackjackPlayerAction.Stand) { break; }
      this.addPlayerCard(...this.cards.draw());
    } while (this.playerValue < 21);
    
    if (this.playerValue > 21) {
      this.endGame(BlackjackWinner.Dealer);
      return [];
    }

    while (this.dealerValue < 17) { this.addDealerCard(...this.cards.draw()); }

    if (this.dealerValue > 21 || this.playerValue > this.dealerValue) {
      this.endGame(BlackjackWinner.Player);
    } else if (this.playerValue < this.dealerValue) {
      this.endGame(BlackjackWinner.Dealer);
    } else {
      this.endGame(BlackjackWinner.None);
    }

    return [];
  }

  addSubscriber(subscriber: subscriber) {
    this.subscribers.push(subscriber); 
  }
  removeSubscriber(subscriber: subscriber) { this.subscribers = this.subscribers.filter(s => s !== subscriber); }

  addToTimeline(action: BlackjackGameAction) {
    this.actionTimeline.push(action);
    this.subscribers.forEach(subscriber => subscriber(action));
  }

  get timeline(): readonly BlackjackGameAction[] { return this.actionTimeline; }

  emptyTimeline() { this.actionTimeline = []; }

  private endGame(winner: BlackjackWinner) {
    this.addToTimeline({
      type: BlackjackGameActionType.EndGame,
      winner
    });
  }

  private addPlayerCard(...cards: Card[]) {
    this.player.add(...cards);
    this.addToTimeline({
      type: BlackjackGameActionType.AddPlayerCard,
      cards,
    });
  }
  private addDealerCard(...cards: Card[]) {
    this.dealer.add(...cards);
    this.addToTimeline({
      type: BlackjackGameActionType.AddDealerCard,
      cards,
    });
  }

  get playerHand() { return this.player.toArray(); }
  get dealerHand() { return this.dealer.toArray(); }
  
  get playerValue() { return this.player.value; }
  get dealerValue() { return this.dealer.value; }
}

tests: {
  break tests;
  const game = new BlackjackGame();
  const playerInterface = game.play();

  game.addSubscriber(action => {
    switch (action.type) {
      case BlackjackGameActionType.AddPlayerCard:
        console.log('cards added to player:', action.cards);
        break;
      case BlackjackGameActionType.AddDealerCard:
        console.log('cards added to dealer:', action.cards);
        break;
      case BlackjackGameActionType.EndGame:
        console.log('game ended with winner:', BlackjackWinner[action.winner!]);
        break;
    }
  });

  for (
    let state = playerInterface.next(), action: BlackjackPlayerAction;;
    state = playerInterface.next(action)
  ) {
    action = game.playerValue < 17 ? BlackjackPlayerAction.Hit : BlackjackPlayerAction.Stand;
    const playerString = game.playerHand.map(card => card.toString()).join(' ');
    const dealerString = game.dealerHand.map(card => card.toString()).join(' ');
    console.log(`player: ${playerString} (${game.playerValue})\ndealer: ${dealerString} (${game.dealerValue})`);

    if (!state.done) { console.log(`player will ${BlackjackPlayerAction[action]}`); continue; }
    break;
  }
}
