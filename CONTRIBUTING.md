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

```shell
npm install -g nx
npx create-nx-workspace@latest --name sushi-go-party \
  --preset=next --appName website --style=css --nxCloud false

npm start
```
