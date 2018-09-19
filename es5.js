//@ts-check
const base = require("./index");
/**
 * @type { import("prettier").Options }
 */
const es5 = {};
for (var nextKey in base) {
  // @ts-ignore
  es5[nextKey] = base[nextKey];
}
// If we're writing es5 code the base config of "all" will cause syntax errors
es5.trailingComma = "es5";

module.exports = es5;
