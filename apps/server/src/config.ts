export const CONFIG = {
  debug: process.env.NX_SUSHI_GO_DEBUG,
  port: process.env.PORT || process.env.NX_SUSHI_GO_SERVER_PORT,
  clientUrl: process.env.NX_SUSHI_GO_CLIENT_URL || '',
  clientOriginRegex: process.env.NX_SUSHI_GO_CLIENT_ORIGIN_REGEX || '(?!)',
};
