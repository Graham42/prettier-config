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
   * have changes across multiple lines. Fortunately GitHub has a great feature
   * for rendering differences in prose documents:
   * https://docs.github.com/en/free-pro-team@latest/github/managing-files-in-a-repository/rendering-differences-in-prose-documents
   *
   * You can also view a reasonable diff in the terminal with `--word-diff`.
   * Or, if you want a more precise terminal diff, `git diff` supports
   * comparing files line by line or word by word, and also supports defining
   * what makes a word. We can define every non-space character as a word so it
   * will ignore all spaces including white-spcae, tab, line-break and
   * carriage-return.
   *
   *    git diff --word-diff-regex=[^[:space:]]
   *
   * If you want to use this often it would be worth creating an alias for:
   *
   *    git config --global --add alias.paragraph-diff 'diff --word-diff-regex=[^[:space:]]'
   *
   * Then you can use it with:
   *
   *    git paragraph-diff
   */
  proseWrap: "always",
};
