//@ts-check
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
   * there's no real meaningful change to it.
   *
   * When using the `git blame` command, git looks at line by line changes.
   * These comma only changes make it more difficult to follow history.
   */
  trailingComma: "all",
  /**
   * When viewing a markdown file with less, cat, vim, etc. the document is
   * much easier to read if the text is hard wrapped at 80 characters.
   *
   * This is a tradeoff because changes will often result in git diffs that
   * have changes across multiple lines. This can be solved by using the
   * --word-diff option.
   */
  proseWrap: "always",
};
