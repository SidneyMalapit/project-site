import fs from 'fs';
import Handlebars from 'handlebars';
import Router from 'koa-router';

import { getView, render } from './serve-util.js';
import routes from './routes.js';
import gamesRouter from './serve-games.js';

const viewsRouter = new Router();

const partials = fs.readdirSync('views/partials')
  .filter((partial) => partial.endsWith('.hbs'))
  .map((partial) => partial.split('.')[0]);
const templateLayout = fs.readFileSync('views/templates/main.hbs', 'utf8');

// register partials
for (const partial of partials) {
  if (partial.startsWith('.')) { continue; }
  const partialContent = fs.readFileSync(`views/partials/${partial}.hbs`, 'utf8');
  Handlebars.registerPartial(partial, partialContent);
}

// root redirects to home route
viewsRouter.redirect('/', '/home');

viewsRouter.use(async (ctx, next) => {
  // default render status is not found
  ctx.status = 404;
  ctx.state.view = {
    template: templateLayout,
    body: render(getView('.not-found')),
    data: {
      title: 'not found',
      status: ctx.status,
      styles: ['/styles/root.css'],
      scripts: [],
      headPartials: [],
      routes
    }
  };

  await next();

  // render view if given, otherwise render 404
  const { view } = ctx.state;
  ctx.body = render(view.template, {
    body: render(view.body, view.data),
    ...view.data
  });
});

// must run gamesRouter before viewsRouter
viewsRouter.use('/games', gamesRouter.routes(), gamesRouter.allowedMethods());

// render view with data given view name
viewsRouter.get('/:viewName', async (ctx) => {
  const { viewName } = ctx.params;

  if (viewName.startsWith('.')) { return; }

  const { view } = ctx.state;
  try { view.body = getView(viewName); }
  catch (error) { return; }
  view.data.title = viewName;
  view.data.styles.push(`/styles/${viewName}.css`);
  view.data.scripts.push(`/scripts/${viewName}.js`);
  ctx.status = 200;
});

export default viewsRouter;
