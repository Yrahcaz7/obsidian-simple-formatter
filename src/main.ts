import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, SimpleFormatterPluginSettings, SimpleFormatterSettingTab } from './settings';
import { simpleFormatPlugin } from './editor'

const CONTAINER_ELEMENTS = new Set<string>(['BLOCKQUOTE', 'OL', 'SECTION', 'UL']);

export default class SimpleFormatterPlugin extends Plugin {
	settings!: SimpleFormatterPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'align-to-left',
			name: 'Align line(s) to left',
			icon: 'text-align-start',
			editorCallback: editor => editor.replaceSelection(this.alignLines(editor.getSelection(), 'left')),
		});

		this.addCommand({
			id: 'align-to-center',
			name: 'Align line(s) to center',
			icon: 'text-align-center',
			editorCallback: editor => editor.replaceSelection(this.alignLines(editor.getSelection(), 'center')),
		});

		this.addCommand({
			id: 'align-to-right',
			name: 'Align line(s) to right',
			icon: 'text-align-end',
			editorCallback: editor => editor.replaceSelection(this.alignLines(editor.getSelection(), 'right')),
		});

		this.addCommand({
			id: 'align-to-justify',
			name: 'Justify line(s)',
			icon: 'text-align-justify',
			editorCallback: editor => editor.replaceSelection(this.alignLines(editor.getSelection(), 'justify')),
		});

		this.addCommand({
			id: 'increase-indentation',
			name: 'Indent line(s)',
			icon: 'list-indent-increase',
			editorCallback: editor => editor.replaceSelection(this.indentLines(editor.getSelection(), this.settings.indentAmount)),
		});

		this.addCommand({
			id: 'decrease-indentation',
			name: 'Unindent line(s)',
			icon: 'list-indent-decrease',
			editorCallback: editor => editor.replaceSelection(this.indentLines(editor.getSelection(), -this.settings.indentAmount)),
		});

		this.addCommand({
			id: 'insert-section-break',
			name: 'Insert section break',
			icon: 'section',
			editorCallback: editor => {
				const sectionBreak = this.alignLines(this.settings.sectionBreak || DEFAULT_SETTINGS.sectionBreak, this.settings.sectionBreakAlign) + '\n';
				const cursorPosition = editor.getCursor();
				editor.replaceRange(sectionBreak, cursorPosition);
				editor.setCursor(cursorPosition.line + 1, 0);
			},
		});

		this.registerEditorExtension(simpleFormatPlugin);

		this.registerMarkdownPostProcessor(element => {
			for (const child of element.children) {
				this.formatElement(child);
			}
		});

		this.addSettingTab(new SimpleFormatterSettingTab(this.app, this));
	}

	private alignLines(lines: string, newTextAlign: string): string {
		if (this.settings.htmlMode) {
			return lines.replace(
				/^(?:<(?i:p)(?:\s+(?i:style)="\s*(.*?\s*)(;?\s*text-align:\s*.+?)?(;.+?)?;?\s*")?\s*>(.*?)<\/\s*(?i:p)\s*>|(.*?))$/gmu,
				(_match: string, preStyles: string = '', oldTextAlign: string = '', postStyles: string = '', tagContent: string = '', noTagContent: string = '') => {
					const alignPrefix = (oldTextAlign.startsWith(';') ? '; ' : '');
					return `<p style="${preStyles}${alignPrefix}text-align: ${newTextAlign}${postStyles}">${noTagContent || tagContent}</p>`;
				},
			);
		}
		return lines.replace(
			/^(.*?)\s*(?:\{\s*style="\s*(.*?\s*)(;?\s*text-align:\s*.+?)?(;.+?)?;?\s*"\s*\})?\s*$/gmu,
			(_match: string, content: string = '', preStyles: string = '', oldTextAlign: string = '', postStyles: string = '') => {
				const alignPrefix = (oldTextAlign.startsWith(';') ? '; ' : '');
				return `${content} {style="${preStyles}${alignPrefix}text-align: ${newTextAlign}${postStyles}"}`;
			},
		);
	}

	private indentLines(lines: string, indentIncrement: number): string {
		if (this.settings.htmlMode) {
			return lines.replace(
				/^(?:<(?i:p)(?:\s+(?i:style)="\s*(.*?\s*)(;?\s*margin-left:\s*(\d+(?:\.\d+)?)em\s*)?(;.+?)?;?\s*")?\s*>(.*?)<\/\s*(?i:p)\s*>|(.*?))$/gmu,
				(_match: string, preStyles: string = '', oldIndentRule: string = '', oldIndentAmount: string = '', postStyles: string = '', tagContent: string = '', noTagContent: string = '') => {
					const indentPrefix = (oldIndentRule.startsWith(';') ? '; ' : '');
					const newIndentAmount = Math.max((+oldIndentAmount || 0) + indentIncrement, 0);
					return `<p style="${preStyles}${indentPrefix}margin-left: ${newIndentAmount}em${postStyles}">${noTagContent || tagContent}</p>`;
				},
			);
		}
		return lines.replace(
			/^(.*?)\s*(?:\{\s*style="\s*(.*?\s*)(;?\s*margin-left:\s*(\d+(?:\.\d+)?)em\s*)?(;.+?)?;?\s*"\s*\})?\s*$/gmu,
			(_match: string, content: string = '', preStyles: string = '', oldIndentRule: string = '', oldIndentAmount: string = '', postStyles: string = '') => {
				const indentPrefix = (oldIndentRule.startsWith(';') ? '; ' : '');
				const newIndentAmount = Math.max((+oldIndentAmount || 0) + indentIncrement, 0);
				return `${content} {style="${preStyles}${indentPrefix}margin-left: ${newIndentAmount}em${postStyles}"}`;
			},
		);
	}

	private formatElement(element: Element) {
		// Consider all element children of containers individually
		if (CONTAINER_ELEMENTS.has(element.tagName)) {
			for (const child of element.children) {
				this.formatElement(child);
			}
			return;
		}
		// Traverse to the element child that most closely holds the text content
		let isFootnote = false;
		if (element.lastChild instanceof Element) {
			if (element.lastChild.classList.contains('footnote-backref')) {
				isFootnote = true;
			} else {
				this.formatElement(element.lastChild);
				return;
			}
		}
		// Get node that holds the text content
		const contentNode = (isFootnote ? element.firstChild : element.lastChild) ?? element;
		if (!contentNode.textContent?.endsWith('}')) {
			return;
		}
		// Parse and hide format syntax
		let childStyles = '';
		contentNode.textContent = contentNode.textContent.replace(/\s*\{\s*style="([^"]+)"\s*\}$/u, (_match: string, styles: string) => {
			childStyles = styles;
			return '';
		});
		// Apply formatting
		const oldStyles = element.getAttribute('style');
		element.setAttribute('style', (oldStyles ? `${oldStyles}; ${childStyles}` : childStyles));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<SimpleFormatterPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
