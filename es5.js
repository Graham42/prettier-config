//@ts-check
const base = require("./index");
/**
 * @type { import("prettier").Options }
 */
const es5 = {
  ...base,
  // If we're writing es5 code the base config of "all" will cause syntax errors
  trailingComma: "es5",
};

module.exports = es5;
