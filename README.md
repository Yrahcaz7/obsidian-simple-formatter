# Obsidian Simple Formatter Plugin

This plugin integrates some simple formatting options into [Obsidian.md](https://obsidian.md).

To use these options, select one or more lines of text in a note and open the [command palette](https://obsidian.md/help/plugins/command-palette).
Optionally, you can use [Obsidian's Hotkeys feature](https://obsidian.md/help/hotkeys) for easier access.

The available commands are as follows:

- **Align paragraph(s) to left/center/right** — align each paragraph in the selected text.
- **Justify paragraph(s)** — Justify each paragraph in the selected text.
- **Indent/Unindent paragraph(s)** — Indent each paragraph in the selected text.
- **Insert Section Break** — Insert a section break.

The formatting also works on embedded notes and images, but not callouts or tables.
Note that aligning an embedded note will align the displayed *content* of the note (except the file name, if it is displayed).

The commands can be customized using the following settings:

- **HTML mode** — When enabled, HTML paragraphs are used for alignment and indentation.
    This has greater cross-compatability than the default, but it disallows Markdown syntax inside aligned and indented blocks.
- **Indentation amount** — The amount of indentation used by the "Indent/Unindent paragraph(s)" commands.
- **Section break indicator** — The characters inserted by the "Insert section break" command.
    Defaults to an asterism (`⁂`).
- **Section break alignment** — The alignment of inserted section breaks. This can be *left*, *center*, or *right*.

## Experimental features

Formatting inside comments (`%%`) should work, but the note's formatting may break until you interact with the note again.

## Installation

The plugin is currently in beta, so it should be installed via the [BRAT plugin](https://github.com/TfTHacker/obsidian42-brat) (which can be [installed via Obsidian](https://obsidian.md/help/community-plugins#Install+a+community+plugin)).

After installing BRAT, follow [BRAT's quick guide](https://tfthacker.com/brat-quick-guide), using `Yrahcaz7/obsidian-simple-formatter` as the link for steps 2 and 4.
