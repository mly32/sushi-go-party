import * as Router from '@koa/router';
import SushiGo from '@sushi-go-party/sushi-go-game';
import { Server, Origins } from 'boardgame.io/server';

const PORT = parseInt(process.env.PORT || process.env.NX_SUSHI_GO_SERVER_PORT);

const server = Server({
  games: [SushiGo],
  origins: [Origins.LOCALHOST],
});

server.router.get('/', (async (ctx) => {
  ctx.body = 'Hello World';
}) as Router.Middleware);

server.run(PORT);
