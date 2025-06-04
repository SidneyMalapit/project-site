import 'dotenv/config';
import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import serve from 'koa-static';

import viewsRouter from './serve-views';

const app = new Koa();

app
.use(async (ctx, next) => {
  await next();

  const accepts = ctx.accepts('js', 'css');
  // serve empty js and css files if not found
  if (accepts && ctx.status === 404) {
    ctx.body = '';
    ctx.type = accepts;
  }
})
.use(json())
.use(logger())
.use(serve('public'));

// serve views
app.use(viewsRouter.routes()).use(viewsRouter.allowedMethods());

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
