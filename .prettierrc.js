// This file and the npm scripts 'check:format' and 'fix:format' were
// generated with the command 'npx @graham42/prettier-config@latest'.
// To receive new updates, run the command again.

/**
 * @type { import("prettier").Options }
 */
module.exports = {
  /*
   * Requiring trailing commas makes git history work better. If you have an
   * object:
   * {
   *   a: 1,
   *   b: 2
   * }
   * and then add a property after 'b':
   * {
   *   a: 1,
   *   b: 2,
   *   c: 3
   * }
   * the line with 'b' gets changed (it now requires a comma) even though
   * there's no meaningful change to it.
   *
   * When using the `git blame` command, git looks at line by line changes.
   * These comma-only changes make it more difficult to follow history.
   */
  trailingComma: "all",
  /**
   * When viewing a markdown file with less, cat, vim, etc. the document is
   * easier to read if the text is hard wrapped at 80 characters.
   *
   * This is a tradeoff because changes will often result in git diffs that
   * have changes across multiple lines. Fortunately GitHub has a great feature
   * for rendering differences in prose documents:
   * https://docs.github.com/en/free-pro-team@latest/github/managing-files-in-a-repository/rendering-differences-in-prose-documents
   *
   * You can also view a reasonable diff in the terminal with `--word-diff`.
   *
   * In the end, this is a personal preference and you're welcome to change it!
   */
  proseWrap: "always",
};
