# CONTRIBUTING

## Commit conventions

This project uses
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#specification).

The commit message should be structured as follows:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

[commit types](https://github.com/pvdlg/conventional-changelog-metahub):

| Commit Type | Title                    | Description                                                                                                 |
| ----------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `feat`      | Features                 | A new feature                                                                                               |
| `fix`       | Bug Fixes                | A bug Fix                                                                                                   |
| `docs`      | Documentation            | Documentation only changes                                                                                  |
| `style`     | Styles                   | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      |
| `refactor`  | Code Refactoring         | A code change that neither fixes a bug nor adds a feature                                                   |
| `perf`      | Performance Improvements | A code change that improves performance                                                                     |
| `test`      | Tests                    | Adding missing tests or correcting existing tests                                                           |
| `build`     | Builds                   | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)         |
| `ci`        | Continuous Integrations  | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| `chore`     | Chores                   | Other changes that don't modify src or test files                                                           |
| `revert`    | Reverts                  | Reverts a previous commit                                                                                   |

## Project creation

The project uses the following technologies (read about them before working on
this project):

- nx
- next
- react
- koa
- boardgame.io

Nx overview:

```shell
# initialize monorepo
npx create-nx-workspace@latest --name sushi-go-party \
  --preset=next --appName website --style=css --nxCloud false \
  && cd sushi-go-party
# generate application
nx generate @nrwl/node:application server
# add dependency (nx will resolve package level)
npm i koa @koa/router @koa/cors
npm i -D @types/koa @types/koa__router @types/koa__cors

npm start website
npm start server
```

Building:

```shell
npx nx build website --prod
npx next start dist/apps/website
npx nx build server --prod
node dist/apps/server/main.js
```

The project is deployed using [Railway](https://railway.app/) and
[Vercel](https://vercel.com/).

Every PR produces an unique isolated environment to play test.
