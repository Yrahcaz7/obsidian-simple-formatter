import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
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

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();

		for (const range of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from: range.from,
				to: range.to,
				enter(node) {
					// Skip selected text
					if (view.state.selection.ranges.some(selectedRange => (selectedRange.from <= node.to) && (selectedRange.to >= node.from))) {
						return;
					}

					// Parse format syntax
					const nodeContent = view.state.sliceDoc(node.from, node.to);
					if (!nodeContent.endsWith('}')) return;
					const matches = nodeContent.match(/\s*\{\s*style="(.+)"\s*\}$/u);
					if (!matches) return;

					// Apply formatting
					const styles = matches[1];
					if (styles) {
						const line = view.state.doc.lineAt(node.from);
						builder.add(
							line.from,
							line.from,
							Decoration.line({
								attributes: {style: styles},
							}),
						);
					}

					// Hide format syntax
					const startIndex = nodeContent.lastIndexOf(matches[0]);
					builder.add(
						node.from + startIndex,
						node.to,
						Decoration.replace({}),
					);

					// Skip child nodes
					return false;
				},
			});
		}
		return builder.finish();
	}
}

export const simpleFormatPlugin = ViewPlugin.fromClass(
	SimpleFormatPlugin,
	{decorations: plugin => plugin.decorations},
);
