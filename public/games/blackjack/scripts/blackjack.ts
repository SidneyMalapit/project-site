import BlackjackGame, {
  BlackjackGameActionType,
  BlackjackWinner,
  BlackjackWinnerDescriptions,
  BlackjackPlayerAction
} from './BlackjackGame.js';
import Deck from './Deck.js';
import Card, { CardSuit, CardRank } from './Card.js';

await new Promise<void>((resolve) => { document.addEventListener('DOMContentLoaded', () => resolve()); });

const startActionBar = document.getElementById('game-start-actions')!;
const playActionBar = document.getElementById('game-play-actions')!;
const deal = document.getElementById('deal')!;
const hit = document.getElementById('hit')!;
const stand = document.getElementById('stand')!;
const playerHand = document.getElementById('player-hand')!;
const dealerHand = document.getElementById('dealer-hand')!;
const [playerCards, dealerCards] = document.getElementsByClassName('cards')!;
const [playerValue, dealerValue] = document.getElementsByClassName('hand-info')!;
const endInfo = document.getElementById('end-info')!;
const startNotice = document.getElementById('start-notice')!;

const cardPlace = new Audio('/assets/sounds/card-place.wav');

const blackjack = new BlackjackGame();

blackjack.addSubscriber((action) => {
  switch (action.type) {
    case BlackjackGameActionType.AddPlayerCard:
      add(playerCards, ...action.cards!);
      playerValue.textContent = blackjack.playerValue.toString();
    break;
    case BlackjackGameActionType.AddDealerCard:
      add(dealerCards, ...action.cards!);
      dealerValue.textContent = blackjack.dealerValue.toString();
    break;
    case BlackjackGameActionType.Initialize:
      reset();
    break;
    case BlackjackGameActionType.EndGame:
      end(action.winner!);
    break;
  }
});

// start of game
deal.addEventListener('click', () => {
  // clear start notice
  startNotice.remove();
}, { once: true });

// keyboard controls
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd': deal.click(); break;
    case 'h': hit.click(); break;
    case 's': stand.click(); break;
  }
});

while (true) {
  await new Promise<void>((resolve) => {
    deal.addEventListener('click', async () => {
      blackjack.reset();

      const game = blackjack.play();
      for (
        let result = game.next();
        !result.done;
        result = game.next(await promptPlayerAction(result.value))
      );

      resolve();
    }, { once: true });
  });
}

function playCardPlace() {
  //cardPlace.currentTime = 0;
  //cardPlace.play();
}

function add(parent: Element, ...cards: Card[]) {
  for (const card of cards) {
    const container = document.createElement('div');
    const img = document.createElement('img');
    img.src = getCardUrl(card);
    img.alt = card.toString();
    container.classList.add('playing-card');
    container.append(img);
    parent.append(container);
  }

  if (playerCards.children.length > 2) { playCardPlace(); }

  if (parent === playerCards) { return; }
  
  if (dealerCards.children.length > 2) {
    playCardPlace();
    const back = parent.querySelector('.playing-card-back');
    if (back) { back.remove(); }
    return;
  }

  const container = document.createElement('div');
  const img = document.createElement('img');
  img.src = getCardBackUrl();
  img.alt = 'back of card';
  container.classList.add('playing-card', 'playing-card-back');
  container.append(img);
  dealerCards.append(container);
}

function end(winner: BlackjackWinner) {
  playActionBar.classList.remove('active');
  startActionBar.classList.add('active');
  endInfo.textContent = BlackjackWinnerDescriptions[winner];

  if (winner === BlackjackWinner.Player) {
    playerCards.classList.add('winner');
  } else if (winner === BlackjackWinner.Dealer) {
    dealerCards.classList.add('winner');
  }
}

function reset() {
  startActionBar.classList.remove('active');
  playActionBar.classList.add('active');
  playerCards.innerHTML = '';
  dealerCards.innerHTML = '';
  endInfo.textContent = '';
  playerCards.classList.remove('winner');
  dealerCards.classList.remove('winner');
}

function getCardUrl(card: Card) {
  const base = '/assets/cards/';
  const suit = CardSuit[card.suit][0];
  const rank = card.rank === CardRank.Ace ? 'A' : card.rank >= 10 ? CardRank[card.rank][0] : card.rank;
  return `${base}${rank}${suit}.svg`;
}

function getCardBackUrl() {
  return '/assets/cards/back.svg';
}

async function promptPlayerAction(available: BlackjackPlayerAction[]): Promise<BlackjackPlayerAction> {
  let action: BlackjackPlayerAction | null = null;

  // continue prompting for user click until action is not null
  while (action === null || !available.includes(action)) {
    action = await new Promise((resolve) => {
      playActionBar.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement)) { return resolve(null); }

        const closest = target.closest('.game-action');
        if (!(closest instanceof HTMLElement)) { return resolve(null); }
        if (!closest.dataset.actionType) { throw Error('Invalid action type'); }

        resolve(parseInt(closest.dataset.actionType) as BlackjackPlayerAction);
      }, { once: true });
    });
  }
  
  return action;
}
