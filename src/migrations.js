const fs = require("fs");

/** @param {string} message */
function log(message) {
  process.stderr.write(message + "\n");
}
////////////////////////////////////////////////////////////////////////////////
// V1

/**
 * @param {{checkFormat?: string, format?: string}} scripts
 */
function cleanPkgScriptsV1(scripts) {
  let newScripts = {
    ...scripts,
  };
  if (
    scripts.checkFormat &&
    scripts.checkFormat.startsWith("prettier --list-different")
  ) {
    delete newScripts.checkFormat;
  }
  if (scripts.format && scripts.format.startsWith("prettier --write")) {
    delete newScripts.format;
  }
  return newScripts;
}
module.exports.cleanPkgScriptsV1 = cleanPkgScriptsV1;

////////////////////////////////////////////////////////////////////////////////
// v2
/**
 * @param {{
 *   'fix:format'?: string
 * }} scripts
 */
function cleanPkgScriptsV2(scripts) {
  let newScripts = {
    ...scripts,
  };
  if (scripts["lint:format"]) {
    delete newScripts["lint:format"];
  }
  return newScripts;
}
module.exports.cleanPkgScriptsV2 = cleanPkgScriptsV2;

const V2_CONFIG_FILENAME = "prettier.config.js";
function updateConfigV2() {
  if (fs.existsSync(V2_CONFIG_FILENAME)) {
    log(`Found outdated config file '${V2_CONFIG_FILENAME}', deleting...`);
    fs.rmSync(V2_CONFIG_FILENAME);
  }
}
module.exports.updateConfigV2 = updateConfigV2;
