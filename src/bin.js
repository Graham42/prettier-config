#!/usr/bin/env node
//@ts-check

const chalk = require("chalk");
const { setupPrettierConfig } = require("./setup");
const { logError } = require("./logger");

setupPrettierConfig().catch((err) => {
  logError(`Sorry! Something went wrong: ${chalk.bold(err.message)}
${chalk.dim(err.stack)}

If this looks like a bug, please raise an issue at
https://github.com/Graham42/prettier-config/issues/new
`);
  process.exit(1);
});
