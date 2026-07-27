import { Line, RangeSetBuilder } from '@codemirror/state';
import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
} from '@codemirror/view';

const PLAIN_LINE_CLASS_NAMES = new Set<string>(['cm-active cm-line', 'cm-line']);

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
		const livePreview = view.dom.parentElement?.classList.contains('is-live-preview');
		const visitedLines = new Set<number>();

		for (const range of view.visibleRanges) {
			const fromLineNum = view.state.doc.lineAt(range.from).number;
			const toLineNum = view.state.doc.lineAt(range.to).number;
			let paragraphLines: Line[] = [];
			for (let lineNum = fromLineNum; lineNum <= toLineNum; lineNum++) {
				// Get next line
				const line = view.state.doc.line(lineNum);
				let lineElement: HTMLElement | null = null;
				// Update paragraph
				if (line.text === '') {
					paragraphLines = [];
				} else {
					lineElement = this.getLineElement(view, line);
					if (!lineElement || !PLAIN_LINE_CLASS_NAMES.has(lineElement.className)) {
						paragraphLines = [];
					}
					paragraphLines.push(line);
				}
				// Skip already visited lines
				if (visitedLines.has(lineNum)) {
					continue;
				}
				visitedLines.add(lineNum);
				// Skip codeblocks
				if (lineElement?.classList.contains('HyperMD-codeblock')) {
					continue;
				}
				// Parse format syntax
				if (!line.text.endsWith('}')) continue;
				const matches = line.text.match(/\s*\{\s*style="([^"]+)"\s*\}$/u);
				if (!matches) continue;
				// Apply formatting
				let styles = matches[1];
				if (styles) {
					styles = styles.replace(/;/g, ' !important;');
					if (!styles.match(/;\s*$/)) styles += ' !important';
					for (const paragraphLine of paragraphLines) {
						builder.add(
							paragraphLine.from,
							paragraphLine.from,
							Decoration.line({
								attributes: {style: styles},
							}),
						);
					}
					paragraphLines = [];
				}
				// Hide format syntax if in live preview mode and the line is not selected
				if (livePreview && !view.state.selection.ranges.some(selectedRange => (selectedRange.from <= line.to) && (selectedRange.to >= line.from))) {
					const startIndex = line.text.lastIndexOf(matches[0]);
					builder.add(
						line.from + startIndex,
						line.to,
						Decoration.replace({}),
					);
				}
			}
		}
		return builder.finish();
	}

	private getLineElement(view: EditorView, line: Line): HTMLElement | null {
		try {
			const node = view.domAtPos(line.from)?.node;
			let element = (node instanceof HTMLElement ? node : node.parentElement);
			while (element !== null) {
				if (element.classList.contains('cm-line')) return element;
				element = element.parentElement;
			}
			return null;
		} catch {
			return null;
		}
	}
}

export const simpleFormatPlugin = ViewPlugin.fromClass(
	SimpleFormatPlugin,
	{decorations: plugin => plugin.decorations},
);
