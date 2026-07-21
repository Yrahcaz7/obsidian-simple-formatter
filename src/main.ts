import { Editor, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, SimpleFormatterPluginSettings, SimpleFormatterSettingTab } from './settings';

function alignLines(lines: string, newTextAlign: string): string {
	return lines.replace(
		/^(?:<(?i:p)(?:\s+(?i:style)="\s*(.*?\s*)(;?\s*text-align:\s*.+?)?(;.+?)?;?\s*")?\s*>(.*?)<\/\s*(?i:p)\s*>|(.*?))$/gmu,
		(_match, preStyles = "", oldTextAlign = "", postStyles = "", tagContent = "", noTagContent = "") => {
			const alignPrefix = (oldTextAlign.startsWith(";") ? "; " : "");
			return `<p style="${preStyles}${alignPrefix}text-align: ${newTextAlign}${postStyles}">${noTagContent || tagContent}</p>`;
		},
	);
}

function indentLines(lines: string, indentIncrement: number): string {
	return lines.replace(
		/^(?:<(?i:p)(?:\s+(?i:style)="\s*(.*?\s*)(;?\s*margin-left:\s*(\d+)em\s*)?(;.+?)?;?\s*")?\s*>(.*?)<\/\s*(?i:p)\s*>|(.*?))$/gmu,
		(_match, preStyles = "", oldIndentRule = "", oldIndentAmount = "", postStyles = "", tagContent = "", noTagContent = "") => {
			const indentPrefix = (oldIndentRule.startsWith(";") ? "; " : "");
			const newIndentAmount = Math.max((parseInt(oldIndentAmount, 10) || 0) + indentIncrement, 0);
			return `<p style="${preStyles}${indentPrefix}margin-left: ${newIndentAmount}em${postStyles}">${noTagContent || tagContent}</p>`;
		},
	);
}

export default class SimpleFormatterPlugin extends Plugin {
	settings!: SimpleFormatterPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'align-to-left',
			name: 'Align line(s) to left',
			icon: 'text-align-start',
			editorCallback: (editor: Editor) => editor.replaceSelection(alignLines(editor.getSelection(), 'left')),
		});

		this.addCommand({
			id: 'align-to-center',
			name: 'Align line(s) to center',
			icon: 'text-align-center',
			editorCallback: (editor: Editor) => editor.replaceSelection(alignLines(editor.getSelection(), 'center')),
		});

		this.addCommand({
			id: 'align-to-right',
			name: 'Align line(s) to right',
			icon: 'text-align-end',
			editorCallback: (editor: Editor) => editor.replaceSelection(alignLines(editor.getSelection(), 'right')),
		});

		this.addCommand({
			id: 'align-to-justify',
			name: 'Justify line(s)',
			icon: 'text-align-justify',
			editorCallback: (editor: Editor) => editor.replaceSelection(alignLines(editor.getSelection(), 'justify')),
		});

		this.addCommand({
			id: 'increase-indentation',
			name: 'Indent line(s)',
			icon: 'list-indent-increase',
			editorCallback: (editor: Editor) => editor.replaceSelection(indentLines(editor.getSelection(), 2)),
		});

		this.addCommand({
			id: 'decrease-indentation',
			name: 'Unindent line(s)',
			icon: 'list-indent-decrease',
			editorCallback: (editor: Editor) => editor.replaceSelection(indentLines(editor.getSelection(), -2)),
		});

		this.addCommand({
			id: 'insert-section-break',
			name: 'Insert Section Break',
			icon: 'section',
			editorCallback: (editor: Editor) => editor.replaceRange(alignLines(this.settings.sectionBreak || DEFAULT_SETTINGS.sectionBreak, this.settings.sectionBreakAlign), editor.getCursor()),
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
