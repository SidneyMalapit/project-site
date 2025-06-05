import fs from 'fs';
import Router from 'koa-router';

import { getView } from './serve-util.js';

const games = fs.readdirSync('./views/games').map((game) => game.split('.')[0]);

const gamesRouter = new Router();

gamesRouter.get('/', (ctx, next) => {
  const { view } = ctx.state;
  view.data.games = games;
  next();
});

gamesRouter.get('/blackjack', (ctx, next) => {
  const { view } = ctx.state;
  view.data.headPartials.push('playing-card-preload');
  next();
});

gamesRouter.get('/:game', (ctx) => {
  const { view } = ctx.state;
  const { game } = ctx.params;
  const viewName = `games/${game}`;
  try { view.body = getView(viewName); } 
  catch (error) { return; }
  view.data.title = game;
  view.data.styles.push(`/${viewName}/styles/${game}.css`);
  view.data.scripts.push(`/${viewName}/scripts/${game}.js`);
  ctx.status = 200;
}); 

export default gamesRouter;
