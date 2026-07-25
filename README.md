# Obsidian Simple Formatter Plugin

This plugin integrates some simple formatting options into [Obsidian.md](https://obsidian.md).

To use these options, select one or more lines of text in a note and open the [command palette](https://obsidian.md/help/plugins/command-palette).

The available commands are as follows:

- **Align line(s) to left/center/right** — align each line in the selected text.
- **Justify line(s)** — Justify each line in the selected text.
- **Indent/Unindent line(s)** — Indent each line in the selected text.
- **Insert Section Break** — Insert a section break. This is especially useful with a keyboard shortcut (set in "Settings → Hotkeys").

The commands can be customized using the following settings:

- **HTML mode** — When enabled, HTML paragraphs are used for alignment and indentation.
    This has greater cross-compatability than the default, but it disallows Markdown syntax inside aligned and indented blocks.
- **Indentation amount** — The amount of indentation used by the "Indent/Unindent line(s)" commands.
- **Section break indicator** — The characters inserted by the "Insert section break" command.
    Defaults to an asterism (`⁂`).
- **Section break alignment** — The alignment of inserted section breaks. This can be *left*, *center*, or *right*.

## Experimental features

Formatting footnotes is currently supported in editing mode, but not reading mode.

When embedding a note inside another note, you can align the *content* of the embedded note (sans the tile) by using an `align` command, or manually adding the style definition:

```markdown
![[Embedded note]] {style="text-align: center"}
```

You can also indent the whole embedded note with the `indent` commands as well.

## Unsupported features

Currently, the contents of callouts and tables cannot be formatted by this plugin.
