# Obsidian Simple Formatter Plugin

This plugin integrates some simple formatting options into [Obsidian.md](https://obsidian.md).

To use these options, select one or more lines of text in a note file and open the [command palette](https://obsidian.md/help/plugins/command-palette).

The avaiable commands are as follows:

- `Align line(s) to left/center/right`: These commands create an HTML paragraph around each line to align the text.
- `Justify line(s)`: This command creates an HTML paragraph around each line to justify the text.
- `Indent/Unindent line(s)`: These commands create an HTML paragraph around each line to indent the text.
- `Insert Section Break`: This command inserts a customizable section break.

The commands can be customized using the following settings:

- `Indentation amount`: The amount of indentation used by the `Indent/Unindent line(s)` commands.
- `Section break indicator`: The characters inserted by the `Insert section break` command. Defaults to `⁂` (U+2042, the unicode character "asterism").
- `Section break alignment`: The alignment of inserted section breaks. This can be `left`, `center`, or `right`.
