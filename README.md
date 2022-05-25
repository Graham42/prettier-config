# :art: Automated project setup - [Prettier][]

This package provides automated setup of [Prettier][] in a new project.

[prettier]: https://prettier.io/

## Usage

```sh
npx @graham42/prettier-config@latest
```

## Features

This package will set up:

- npm scripts `check:format` and `fix:format` in package.json
- a `.prettierrc.js` file with config for better git diffs
- a `.gitignore` file if one doesn't exist using `npx gitignore@latest node`
- the `prettier` package
- [VS Code](https://code.visualstudio.com/) project settings to format on save
  using Prettier
- the VS Code Prettier extension as a
  [recommended workspace extension](https://code.visualstudio.com/docs/editor/extension-marketplace#_workspace-recommended-extensions)
  to help new contributors to your project get up and running
