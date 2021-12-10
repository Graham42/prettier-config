#!/usr/bin/env node
//@ts-check

let fs = require("fs");
let path = require("path");
let chalk = require("chalk");
let commentJSON = require("comment-json");
let { format } = require("prettier");
let {
  cleanPkgScriptsV1,
  cleanPkgScriptsV2,
  updateConfigV2,
} = require("./migrations.js");

let CONFIG_FILENAME = ".prettierrc.js";
let PRETTIER_CONFIG_FILENAMES = [
  //
  ".prettierrc",
  ".prettierrc.json",
  ".prettierrc.yml",
  ".prettierrc.yaml",
  ".prettierrc.json5",
  ".prettierrc.js",
  ".prettierrc.cjs",
  ".prettierrc.config.js",
  ".prettierrc.config.cjs",
  ".prettierrc.toml",
];
// This list is an approximation based on the supported parsers
// https://prettier.io/docs/en/options.html#parser
let PRETTIER_FILE_EXTENSIONS = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "html",
  "vue",
  "css",
  "less",
  "scss",
  "graphql",
  "yaml",
  "yml",
  "json",
  "json5",
  "md",
  "mdx",
];
const PRETTIER_VSCODE_LANGUAGE_IDS = [
  "[javascript]",
  "[javascriptreact]",
  "[typescript]",
  "[typescriptreact]",
  "[html]",
  "[vue]",
  "[css]",
  "[less]",
  "[scss]",
  "[graphql]",
  "[yaml]",
  "[json]",
  "[json5]",
  "[markdown]",
  "[mdx]",
];

/** @param {string} message */
function log(message) {
  process.stderr.write(message + "\n");
}
/** @param {string} message */
function logError(message) {
  log(chalk.red("ERROR: ") + message);
}
/** @param {string} message */
function logWarning(message) {
  log(chalk.yellow("WARNING: ") + message);
}

async function main() {
  if (!fs.existsSync("package.json")) {
    logError(
      `No 'package.json'  file found in the current directory. Make sure you are
in the project root and then try again. If no 'package.json' file exists yet,
run 'npm init' first.`,
    );
    process.exit(1);
  }
  let pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

  updateConfigV2();
  for (let filename of PRETTIER_CONFIG_FILENAMES) {
    if (filename === CONFIG_FILENAME) continue;
    if (fs.existsSync(filename)) {
      logWarning(
        `found existing prettier config file '${filename}'. This will conflict
with the new config file that at '${CONFIG_FILENAME}'. Please delete the
existing config file to avoid conflicts.`,
      );
    }
  }
  let hasPrettierInPackageJson = Boolean(pkg["prettier"]);
  if (hasPrettierInPackageJson) {
    logWarning(
      `Found 'prettier' configuration in your 'package.json' file. This will
conflict with the new configuration at '${CONFIG_FILENAME}'. Please delete this
configuration block to avoid conflicts.`,
    );
  }

  log(`Writing new config file to ${CONFIG_FILENAME}...`);
  let prettierConfigRaw =
    `// This file and the npm scripts 'check:format' and 'lint:format' were
// generated with 'npx @graham42/prettier-config@latest'.
` +
    fs
      .readFileSync(path.join(__dirname, "index.js"), "utf8")
      .replace(/\/\/@ts-check/, "");
  fs.writeFileSync(CONFIG_FILENAME, prettierConfigRaw, "utf-8");

  log(`Creating scripts in package.json...`);
  let targetFilesGlob = `**/*.{${PRETTIER_FILE_EXTENSIONS.join(",")}}`;
  pkg.scripts = pkg.scripts || {};
  pkg.scripts = cleanPkgScriptsV1(pkg.scripts);
  pkg.scripts = cleanPkgScriptsV2(pkg.scripts);
  // The double quotes are needed for this to work across platforms
  // (looking at you Windows)
  pkg.scripts[
    "prettier"
  ] = `prettier --ignore-path .gitignore  "${targetFilesGlob}"`;
  pkg.scripts["check:format"] = `npm run prettier -- --check`;
  pkg.scripts["fix:format"] = `npm run prettier -- --write`;
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2), "utf8");

  log(`Installing prettier...`);
  require("child_process").execSync("npm install --save-dev prettier@^2", {
    stdio: "inherit",
  });

  if (!fs.existsSync(".gitignore")) {
    log("No '.gitignore' file found, creating one now...");
    require("child_process").execSync("npx gitignore@latest node", {
      stdio: "inherit",
    });
  }

  log("Updating VS Code project settings to use prettier plugin...");
  /** @type {any} */
  let vscodeSettings = {};
  if (fs.existsSync(".vscode/settings.json")) {
    vscodeSettings = commentJSON.parse(
      fs.readFileSync(".vscode/settings.json", "utf-8"),
    );
  }
  if (!fs.existsSync(".vscode")) {
    fs.mkdirSync(".vscode");
  }
  for (let languageID of PRETTIER_VSCODE_LANGUAGE_IDS) {
    vscodeSettings[languageID] = vscodeSettings[languageID] || {};
    // We need to set this because if multiple formatters are available, and no
    // default is specified, the formatting won't apply on save.
    vscodeSettings[languageID]["editor.defaultFormatter"] =
      "esbenp.prettier-vscode";
  }
  vscodeSettings["editor.formatOnSave"] = true;
  let vscodeSettingsResult = commentJSON
    // must include the null and 2 spaces here otherwise comments are not preserved
    .stringify(vscodeSettings, null, 2)
    // This is a hack to try and condense the settings we've added
    .replace(/\"\s*\}/g, '"}')
    .replace(/\{\s*\"/g, '{"');
  vscodeSettingsResult = format(vscodeSettingsResult, { parser: "json" });
  fs.writeFileSync(".vscode/settings.json", vscodeSettingsResult, "utf-8");

  // TODO - Future enhancement, detect if `code` cli is available and use that
  // to install the prettier extension automatically

  log(`
${chalk.bgBlack.blue("Prettier setup complete!")}
You can see the new and updated files with 'git status' and 'git diff'.

I recommend you create a commit with this new configuration, and then a second
commit with any formatting changes, to make reviewing easier.

For the first commit you can run

    git add --update # This adds all files that were already tracked by git
    git add package.json package-lock.json ${CONFIG_FILENAME} .gitignore
    git commit -m "chore: configure prettier" \\
        -m "Autoformatting makes for an awesome developer experience!"

For the second commit, first run the autoformat script, then create the commit

    npm run fix:format
    git add --update
    git commit -m "chore: autoformat code with prettier"

🎉 All Done!
`);
}

main().catch((err) => {
  logError(`Sorry! Something went wrong: ${chalk.bold(err.message)}
${chalk.dim(err.stack)}

If this looks like a bug, please raise an issue at
https://github.com/Graham42/prettier-config/issues/new
`);
  process.exit(1);
});
