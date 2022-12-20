import { AddressInfo } from 'net';

import * as cors from '@koa/cors';
import * as Router from '@koa/router';
import * as Koa from 'koa';

interface Game {
  id: string;
}

const PORT = 4201;
const app = new Koa();
const router = new Router();

const logger = async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
};

const responseTime = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
};

router.use(logger).use(responseTime);

router.get('/', async (ctx) => {
  ctx.body = 'Hello World';
});

router.get('/game', async (ctx) => {
  ctx.body = { id: '<empty>' } as Game;
});

router.get('/game/:id', async (ctx) => {
  ctx.body = { id: ctx.params.id } as Game;
});

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(PORT);
console.log(`server opened on ${(server.address() as AddressInfo).port}...`);
