//@ts-check

const chalk = require("chalk");
const { setupPrettierConfig } = require("./setup");
const { UserError, logError } = require("./util");

setupPrettierConfig().catch((err) => {
  if (err instanceof UserError) {
    logError(err.message);
    process.exit(1);
  }

  logError(`Sorry! Something went wrong: ${chalk.bold(err.message)}
${chalk.dim(err.stack)}

If this looks like a bug, please raise an issue at
https://github.com/Graham42/prettier-config/issues/new
`);
  process.exit(1);
});
