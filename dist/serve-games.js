"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const koa_router_1 = __importDefault(require("koa-router"));
const serve_util_1 = require("./serve-util");
const games = fs_1.default.readdirSync('./views/games').map((game) => game.split('.')[0]);
const gamesRouter = new koa_router_1.default();
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
    try {
        view.body = (0, serve_util_1.getView)(viewName);
    }
    catch (error) {
        return;
    }
    view.data.title = game;
    view.data.styles.push(`/${viewName}/styles/${game}.css`);
    view.data.scripts.push(`/${viewName}/scripts/${game}.js`);
    ctx.status = 200;
});
exports.default = gamesRouter;
