# Obsidian Simple Formatter Plugin

This plugin integrates some simple formatting options into [Obsidian.md](https://obsidian.md).

To use these options, select one or more lines of text in a note file and open the [command palette](https://obsidian.md/help/plugins/command-palette).

The avaiable commands are as follows:

- `Align line(s) to left/center/right`: Align each line in the selected text.
- `Justify line(s)`: Justify each line in the selected text.
- `Indent/Unindent line(s)`: Indent each line in the selected text.
- `Insert Section Break`: Insert a customizable section break.

The commands can be customized using the following settings:

- `HTML mode`: When enabled, HTML paragraphs are used for alignment and indentation. This has greater cross-compatability than the default, but it disallows Markdown syntax inside aligned and indented blocks.
- `Indentation amount`: The amount of indentation used by the `Indent/Unindent line(s)` commands.
- `Section break indicator`: The characters inserted by the `Insert section break` command. Defaults to `⁂` (U+2042, the unicode character "asterism").
- `Section break alignment`: The alignment of inserted section breaks. This can be `left`, `center`, or `right`.
