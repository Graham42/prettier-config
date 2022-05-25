//@ts-check

const chalk = require("chalk");
const { execSync } = require("child_process");
const fs = require("fs");
const { log } = require("./logger");

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

function updateConfigV1() {
  execSync("npm uninstall @graham42/prettier-config", { stdio: "inherit" });
}
module.exports.updateConfigV1 = updateConfigV1;

////////////////////////////////////////////////////////////////////////////////
// v2
/**
 * @param {{
 *   'lint:format'?: string
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
/**
 * @returns {{
 *   needsPrettierIgnore: boolean;
 * }}
 */
function updateConfigV2() {
  if (fs.existsSync(V2_CONFIG_FILENAME)) {
    log(`Found outdated config file '${V2_CONFIG_FILENAME}', deleting...`);
    fs.rmSync(V2_CONFIG_FILENAME);
  }

  /** @param {string} contents */
  function stripIgnoreFile(contents) {
    return contents
      .split(/\r?\n/)
      .map((line) =>
        line
          // remove comments
          .replace(/#.*$/, "")
          .trim()
          // remove trailing slashes as they don't make a functional difference
          .replace(/\/$/, ""),
      )
      .filter((line) => line.length > 0);
  }

  let needsPrettierIgnore = false;
  if (fs.existsSync(".prettierignore")) {
    let prettierIgnore = stripIgnoreFile(
      fs.readFileSync(".prettierignore", "utf-8"),
    ).filter(
      (line) =>
        // Prettier used to cause conflicts for package.json and package-lock.json
        // files, with difference in formatting vs the result of 'npm install',
        // but now it's been fixed, so we can safely skip these ignores
        !/^package.*json$/.test(line),
    );
    let gitIgnore = stripIgnoreFile(fs.readFileSync(".gitignore", "utf-8"));

    let notInGitIgnore = prettierIgnore.filter(
      (line) => !gitIgnore.includes(line),
    );
    if (notInGitIgnore.length > 0) {
      needsPrettierIgnore = true;
      log(
        chalk.yellow(
          "Found the following lines in .prettierignore that aren't in .gitignore.\n\n",
        ) +
          notInGitIgnore.map((line) => "  " + line).join("\n") +
          chalk.yellow(`\n
If these are files that can be ignored by git, add them to .gitignore and rerun
this script and then you won't need the extra .prettierignore file
`),
      );
    }
    if (!needsPrettierIgnore) {
      fs.rmSync(".prettierignore");
    }
  }
  // read prettier ignore
  /// look for dups gitignore, if all dups delete, otherwise
  // print a warning warning with steps for updating script
  return { needsPrettierIgnore };
}
module.exports.updateConfigV2 = updateConfigV2;
