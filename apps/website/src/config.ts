export const CONFIG = {
  debug: process.env.NX_SUSHI_GO_DEBUG === 'true',
  serverUrl: process.env.NX_SUSHI_GO_SERVER_URL,
  storagePrefix: process.env.NX_SUSHI_GO_STORAGE_PREFIX,
  lobbyPollingInterval:
    parseInt(process.env.NX_SUSHI_GO_LOBBY_POLLING_INTERVAL) || 5000,
  joinPollingInterval:
    parseInt(process.env.NX_SUSHI_GO_JOIN_POLLING_INTERVAL) || 1000,
};
