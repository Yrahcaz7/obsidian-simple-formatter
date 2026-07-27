# Obsidian Simple Formatter Plugin

This plugin integrates some simple formatting options into [Obsidian.md](https://obsidian.md).

To use these options, select one or more lines of text in a note and open the [command palette](https://obsidian.md/help/plugins/command-palette).
Optionally, you can use [Obsidian's Hotkeys feature](https://obsidian.md/help/hotkeys) for easier access.

The available commands are as follows:

- **Align line(s) to left/center/right** — align each line in the selected text.
- **Justify line(s)** — Justify each line in the selected text.
- **Indent/Unindent line(s)** — Indent each line in the selected text.
- **Insert Section Break** — Insert a section break.

The commands can be customized using the following settings:

- **HTML mode** — When enabled, HTML paragraphs are used for alignment and indentation.
    This has greater cross-compatability than the default, but it disallows Markdown syntax inside aligned and indented blocks.
- **Indentation amount** — The amount of indentation used by the "Indent/Unindent line(s)" commands.
- **Section break indicator** — The characters inserted by the "Insert section break" command.
    Defaults to an asterism (`⁂`).
- **Section break alignment** — The alignment of inserted section breaks. This can be *left*, *center*, or *right*.

## Experimental features

When embedding a note inside another note, you can align the *content* of the embedded note (sans the tile) by using an `align` command, or manually adding the style definition:

```markdown
![[Embedded note]] {style="text-align: center"}
```

You can also indent the whole embedded note with the `indent` commands as well.

## Unsupported features

Currently, callouts and tables (as well as their contents) cannot be formatted by this plugin.

## Installation

The plugin is currently in beta, so it should be installed via the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat) (which can be [installed via Obsidian](https://obsidian.md/help/community-plugins#Install+a+community+plugin)).

After installing BRAT, follow [BRAT's quick guide](https://tfthacker.com/brat-quick-guide), using `Yrahcaz7/obsidian-simple-formatter` as the link for steps 2 and 4.
