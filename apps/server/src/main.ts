import * as Router from '@koa/router';
import SushiGo from '@sushi-go-party/sushi-go-game';
import { Server } from 'boardgame.io/server';

import { CONFIG } from './config';

const server = Server({
  games: [SushiGo],
  origins: [CONFIG.clientUrl, new RegExp(CONFIG.clientOriginRegex)],
});

const router: Router = server.router;

router.get('/health', (ctx) => {
  ctx.body = 'Ok';
});

server.run(parseInt(CONFIG.port)).then(() => {
  console.log('environment:', CONFIG);
});
