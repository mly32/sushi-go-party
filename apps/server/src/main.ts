import * as Router from '@koa/router';
import SushiGo from '@sushi-go-party/sushi-go-game';
import { Server } from 'boardgame.io/server';

const PORT = parseInt(process.env.PORT || process.env.NX_SUSHI_GO_SERVER_PORT);

const clientOriginRegex = new RegExp(
  process.env.NX_SUSHI_GO_CLIENT_ORIGIN_REGEX || '(?!)'
);
const clientUrl = process.env.NX_SUSHI_GO_CLIENT_URL || '';

const server = Server({
  games: [SushiGo],
  origins: [clientUrl, clientOriginRegex],
});

server.router.get('/', (async (ctx) => {
  ctx.body = `Hello World! client: ${clientUrl}`;
}) as Router.Middleware);

server.run(PORT);
