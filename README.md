# Prettier Config

[Prettier](https://prettier.io) is an awesome tool, however I have a preference
for some config that differs from the defaults. My reasoning is fully explained
in the [config file](./index.js).

# Setup

Run this command to install and configure prettier:

```sh
npx @graham42/prettier-config
```

Or, manually add the following config

```js
// prettier.config.js

var config = require("@graham42/prettier-config");
module.exports = config;
```

```sh
# .prettierignore

node_modules/
# `npm install` does its' own formatting of the package.json and package-lock.json
# files
package*.json
```
