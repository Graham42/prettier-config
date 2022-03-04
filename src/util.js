//@ts-check

const chalk = require("chalk");

/**
 * Progress messages should go to stderr so that the output from one CLI tool
 * can be safely piped into another CLI tool.
 *
 * @param {string} message
 */
function log(message) {
  process.stderr.write(message + "\n");
}
module.exports.log = log;
/** @param {string} message */
function logError(message) {
  log(chalk.red("ERROR: ") + message);
}
module.exports.logError = logError;
/** @param {string} message */
function logWarning(message) {
  log(chalk.yellow("WARNING: ") + message);
}
module.exports.logWarning = logWarning;
