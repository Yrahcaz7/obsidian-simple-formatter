import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, SimpleFormatterPluginSettings, SimpleFormatterSettingTab } from './settings';
import { simpleFormatPlugin } from './editor'

export default class SimpleFormatterPlugin extends Plugin {
	settings!: SimpleFormatterPluginSettings;

	private alignLines(lines: string, newTextAlign: string): string {
		if (this.settings.htmlMode) {
			return lines.replace(
				/^(?:<(?i:p)(?:\s+(?i:style)="\s*(.*?\s*)(;?\s*text-align:\s*.+?)?(;.+?)?;?\s*")?\s*>(.*?)<\/\s*(?i:p)\s*>|(.*?))$/gmu,
				(_match, preStyles = "", oldTextAlign = "", postStyles = "", tagContent = "", noTagContent = "") => {
					const alignPrefix = (oldTextAlign.startsWith(";") ? "; " : "");
					return `<p style="${preStyles}${alignPrefix}text-align: ${newTextAlign}${postStyles}">${noTagContent || tagContent}</p>`;
				},
			);
		}
		return lines.replace(
			/^(.*?)\s*(?:\{\s*style="\s*(.*?\s*)(;?\s*text-align:\s*.+?)?(;.+?)?;?\s*"\s*\})?\s*$/gmu,
			(_match, content = "", preStyles = "", oldTextAlign = "", postStyles = "") => {
				const alignPrefix = (oldTextAlign.startsWith(";") ? "; " : "");
				return `${content} {style="${preStyles}${alignPrefix}text-align: ${newTextAlign}${postStyles}"}`;
			},
		);
	}

	private indentLines(lines: string, indentIncrement: number): string {
		if (this.settings.htmlMode) {
			return lines.replace(
				/^(?:<(?i:p)(?:\s+(?i:style)="\s*(.*?\s*)(;?\s*margin-left:\s*(\d+(?:\.\d+)?)em\s*)?(;.+?)?;?\s*")?\s*>(.*?)<\/\s*(?i:p)\s*>|(.*?))$/gmu,
				(_match, preStyles = "", oldIndentRule = "", oldIndentAmount = "", postStyles = "", tagContent = "", noTagContent = "") => {
					const indentPrefix = (oldIndentRule.startsWith(";") ? "; " : "");
					const newIndentAmount = Math.max((+oldIndentAmount || 0) + indentIncrement, 0);
					return `<p style="${preStyles}${indentPrefix}margin-left: ${newIndentAmount}em${postStyles}">${noTagContent || tagContent}</p>`;
				},
			);
		}
		return lines.replace(
			/^(.*?)\s*(?:\{\s*style="\s*(.*?\s*)(;?\s*margin-left:\s*(\d+(?:\.\d+)?)em\s*)?(;.+?)?;?\s*"\s*\})?\s*$/gmu,
			(_match, content = "", preStyles = "", oldIndentRule = "", oldIndentAmount = "", postStyles = "") => {
				const indentPrefix = (oldIndentRule.startsWith(";") ? "; " : "");
				const newIndentAmount = Math.max((+oldIndentAmount || 0) + indentIncrement, 0);
				return `${content} {style="${preStyles}${indentPrefix}margin-left: ${newIndentAmount}em${postStyles}"}`;
			},
		);
	}

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
			name: 'Insert Section Break',
			icon: 'section',
			editorCallback: editor => editor.replaceRange(this.alignLines(this.settings.sectionBreak || DEFAULT_SETTINGS.sectionBreak, this.settings.sectionBreakAlign), editor.getCursor()),
		});

		this.registerEditorExtension(simpleFormatPlugin);

		this.registerMarkdownPostProcessor(element => {
			for (const child of element.children) {
				if (!child.innerHTML.endsWith('}')) {
					continue;
				}
				let childStyles = '';
				child.innerHTML = child.innerHTML.replace(/\s*\{\s*style="(.+)"\s*\}$/u, (_match: string, styles: string) => {
					childStyles = styles;
					return '';
				});
				const oldStyles = child.getAttribute('style');
				child.setAttribute('style', (oldStyles ? `${oldStyles}; ${childStyles}` : childStyles));
			}
		});

		this.addSettingTab(new SimpleFormatterSettingTab(this.app, this));
	}

	async onunload() {}

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
