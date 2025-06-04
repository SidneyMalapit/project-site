"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const koa_router_1 = __importDefault(require("koa-router"));
const serve_util_1 = require("./serve-util");
const routes_1 = __importDefault(require("./routes"));
const serve_games_1 = __importDefault(require("./serve-games"));
const viewsRouter = new koa_router_1.default();
const partials = fs_1.default.readdirSync('views/partials')
    .filter((partial) => partial.endsWith('.hbs'))
    .map((partial) => partial.split('.')[0]);
const templateLayout = fs_1.default.readFileSync('views/templates/main.hbs', 'utf8');
// register partials
for (const partial of partials) {
    if (partial.startsWith('.')) {
        continue;
    }
    const partialContent = fs_1.default.readFileSync(`views/partials/${partial}.hbs`, 'utf8');
    handlebars_1.default.registerPartial(partial, partialContent);
}
// root redirects to home route
viewsRouter.redirect('/', '/home');
viewsRouter.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    // default render status is not found
    ctx.status = 404;
    ctx.state.view = {
        template: templateLayout,
        body: (0, serve_util_1.render)((0, serve_util_1.getView)('.not-found')),
        data: {
            title: 'not found',
            status: ctx.status,
            styles: ['/styles/root.css'],
            scripts: [],
            headPartials: [],
            routes: routes_1.default
        }
    };
    yield next();
    // render view if given, otherwise render 404
    const { view } = ctx.state;
    ctx.body = (0, serve_util_1.render)(view.template, Object.assign({ body: (0, serve_util_1.render)(view.body, view.data) }, view.data));
}));
// must run gamesRouter before viewsRouter
viewsRouter.use('/games', serve_games_1.default.routes(), serve_games_1.default.allowedMethods());
// render view with data given view name
viewsRouter.get('/:viewName', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { viewName } = ctx.params;
    if (viewName.startsWith('.')) {
        return;
    }
    const { view } = ctx.state;
    try {
        view.body = (0, serve_util_1.getView)(viewName);
    }
    catch (error) {
        return;
    }
    view.data.title = viewName;
    view.data.styles.push(`/styles/${viewName}.css`);
    view.data.scripts.push(`/scripts/${viewName}.js`);
    ctx.status = 200;
}));
exports.default = viewsRouter;
