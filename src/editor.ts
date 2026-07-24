import { Line, RangeSetBuilder } from '@codemirror/state';
import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
} from '@codemirror/view';

class SimpleFormatPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged || update.focusChanged || update.selectionSet) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {}

	private buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();

		for (const range of view.visibleRanges) {
			let prevLine: Line | undefined;
			while (true) {
				// Get next line
				let line: Line;
				try {
					line = view.state.doc.lineAt(prevLine === undefined ? range.from : prevLine.to + 1);
					prevLine = line;
				} catch (err) {
					break;
				}
				// Skip selected text
				if (view.state.selection.ranges.some(selectedRange => (selectedRange.from <= line.to) && (selectedRange.to >= line.from))) {
					continue;
				}
				// Parse format syntax
				if (!line.text.endsWith('}')) continue;
				const matches = line.text.match(/\s*\{\s*style="(.+)"\s*\}$/u);
				if (!matches) continue;
				// Apply formatting
				let styles = matches[1];
				if (styles) {
					styles = styles.replace(/;/g, " !important;");
					if (!styles.match(/;\s*$/)) styles += " !important";
					builder.add(
						line.from,
						line.from,
						Decoration.line({
							attributes: {style: styles},
						}),
					);
				}
				// Hide format syntax
				const startIndex = line.text.lastIndexOf(matches[0]);
				builder.add(
					line.from + startIndex,
					line.to,
					Decoration.replace({}),
				);
			}
		}
		return builder.finish();
	}
}

export const simpleFormatPlugin = ViewPlugin.fromClass(
	SimpleFormatPlugin,
	{decorations: plugin => plugin.decorations},
);
