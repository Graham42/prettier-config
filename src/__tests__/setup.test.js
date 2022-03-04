//@ts-check

// ORIG_DIR=$(pwd)
// function finish {
//     cd "$ORIG_DIR"
//     echo "Results in $TEMP_DIR"
// }
// trap finish EXIT

// TEMP_DIR="$(mktemp -d)"
// cd "$TEMP_DIR"
// npm init -y
// npx "$ORIG_DIR"
// ls -a

// echo "'.prettierrc.js' should exist"
// [ -e ".prettierrc.js" ]

// echo "'.gitignore' should exist"
// [ -e ".gitignore" ]

// echo "check:format script should exist"
// npm run check:format

// echo "fix:format script should exist"
// npm run fix:format

const { existsSync } = require("fs");
const fsPromises = require("fs/promises");
const os = require("os");
const path = require("path");
const process = require("process");
const { execSync } = require("child_process");

/** @type {import("tree-node-cli").default} */
//@ts-ignore the default export is bugged for the package currently
const tree = require("tree-node-cli");

const { setupPrettierConfig } = require("../setup");

describe("setup tests", () => {
  /** @type {string} */
  let workingDir;
  /** @type {string} */
  let originalCwd;
  beforeEach(async () => {
    // create a temporary directory for each test for isolation
    workingDir = await fsPromises.mkdtemp(
      path.join(os.tmpdir(), "prettier-config-test"),
    );
    originalCwd = process.cwd();
    process.chdir(workingDir);
    execSync("npm init -y", { encoding: "utf-8" });
  });
  afterEach(async () => {
    process.chdir(originalCwd);
    await fsPromises.rm(workingDir, { recursive: true, force: true });
  });

  it("should setup current version in fresh project", async () => {
    setupPrettierConfig();

    expectProjectStructure(workingDir);
    await expectProjectContents(workingDir);
  });

  it("should migrate from v1", async () => {
    execSync("npx @graham42/prettier-config@^1", { encoding: "utf-8" });
    setupPrettierConfig();

    expectProjectStructure(workingDir);
    await expectProjectContents(workingDir);
  }, 20000);

  it("should migrate from v2", async () => {
    execSync("npx @graham42/prettier-config@^2", { encoding: "utf-8" });
    setupPrettierConfig();

    expectProjectStructure(workingDir);
    await expectProjectContents(workingDir);
  }, 20000);

  it("should migrate from v2 with a required ignore file", async () => {
    execSync("npx @graham42/prettier-config@^2", { encoding: "utf-8" });
    let prettierIgnoreContents = await fsPromises.readFile(".prettierignore", {
      encoding: "utf-8",
    });
    await fsPromises.writeFile(
      ".prettierignore",
      prettierIgnoreContents + "\nfoo\nbar\n",
      { encoding: "utf-8" },
    );
    setupPrettierConfig();

    // the prettierignore file should still be there
    expect(existsSync(".prettierignore")).toEqual(true);

    // the prettier script should use prettierignore, not gitignore
    let packageJsonRaw = await fsPromises.readFile(
      path.join(workingDir, "package.json"),
      { encoding: "utf-8" },
    );
    let packageJson = JSON.parse(packageJsonRaw);
    expect(packageJson.scripts.prettier).toMatchInlineSnapshot(
      `"prettier \\"**/*.{js,jsx,ts,tsx,html,vue,css,less,scss,graphql,yaml,yml,json,json5,md,mdx}\\""`,
    );
    /**/
    // following the instructions to remove the items from the file, and then
    // re-run the setup should complete the upgrade
    await fsPromises.writeFile(".prettierignore", "", { encoding: "utf-8" });
    setupPrettierConfig();
    expect(existsSync(".prettierignore")).toEqual(false);
    let nextPackageJsonRaw = await fsPromises.readFile(
      path.join(workingDir, "package.json"),
      { encoding: "utf-8" },
    );
    let nextPackageJson = JSON.parse(nextPackageJsonRaw);
    // This script should use gitignore, not the default prettierignore
    expect(nextPackageJson.scripts.prettier).toMatchInlineSnapshot(
      `"prettier --ignore-path .gitignore \\"**/*.{js,jsx,ts,tsx,html,vue,css,less,scss,graphql,yaml,yml,json,json5,md,mdx}\\""`,
    );
    /**/
  }, 20000);

  it("should overwrite existing prettier config in a file", async () => {
    let oldConfigFile = ".prettierrc";
    await fsPromises.writeFile(
      oldConfigFile,
      JSON.stringify({ proseWrap: "never" }),
      { encoding: "utf-8" },
    );
    setupPrettierConfig();

    expect(existsSync(oldConfigFile)).toEqual(false);
  });

  it("should overwrite existing prettier config in package.json", async () => {
    let packageJsonRaw = await fsPromises.readFile(
      path.join(workingDir, "package.json"),
      { encoding: "utf-8" },
    );
    let packageJson = JSON.parse(packageJsonRaw);
    packageJson.prettier = { proseWrap: "never" };
    await fsPromises.writeFile("package.json", JSON.stringify(packageJson), {
      encoding: "utf-8",
    });
    setupPrettierConfig();

    let packageJsonRawAfter = await fsPromises.readFile(
      path.join(workingDir, "package.json"),
      { encoding: "utf-8" },
    );
    let packageJsonAfter = JSON.parse(packageJsonRawAfter);
    expect(packageJsonAfter.prettier).toBeUndefined();
  });

  it("should setup in existing project", async () => {
    // make some modifications to assert that specific files aren't overwritten
    // run the setup
    // verify existing bits are still there
    console.log("TODO stub");
  });
});

/** @param {string} workingDir */
function expectProjectStructure(workingDir) {
  let structure = tree(workingDir, {
    allFiles: true,
    exclude: [/node_modules/],
    dirsFirst: true,
    trailingSlash: true,
  });
  structure = structure.replace(path.basename(workingDir), "__WORK_DIR__");
  expect(structure).toMatchSnapshot();
}

/**
 * Verify the contents of files created or modified by the setup
 *
 * @param {string} workingDir
 */
async function expectProjectContents(workingDir) {
  let vscodeSettingsRaw = await fsPromises.readFile(
    path.join(workingDir, ".vscode", "settings.json"),
    { encoding: "utf-8" },
  );
  expect(vscodeSettingsRaw).toMatchSnapshot();

  let vscodeExtensionsRaw = await fsPromises.readFile(
    path.join(workingDir, ".vscode", "extensions.json"),
    { encoding: "utf-8" },
  );
  expect(vscodeExtensionsRaw).toMatchSnapshot();

  let prettierConfigRaw = await fsPromises.readFile(
    path.join(workingDir, ".prettierrc.js"),
    { encoding: "utf-8" },
  );
  expect(prettierConfigRaw).toMatchSnapshot();

  let packageJsonRaw = await fsPromises.readFile(
    path.join(workingDir, "package.json"),
    { encoding: "utf-8" },
  );
  let packageJson = JSON.parse(packageJsonRaw);
  // filter out fields that can change without impact to prettier
  let relevant = {
    scripts: packageJson.scripts,
    devDependencies: packageJson.devDependencies,
    dependencies: packageJson.dependencies,
    prettier: packageJson.prettier,
  };
  expect(relevant).toMatchSnapshot();
}
