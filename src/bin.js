//ts-check

const { main } = require("./setup");

main().catch((err) => {
  logError(`Sorry! Something went wrong: ${chalk.bold(err.message)}
${chalk.dim(err.stack)}

If this looks like a bug, please raise an issue at
https://github.com/Graham42/prettier-config/issues/new
`);
  process.exit(1);
});
