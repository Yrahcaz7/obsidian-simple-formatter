import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Modal,
	Notice,
	Plugin,
} from 'obsidian';

import {
	DEFAULT_SETTINGS,
	SimpleFormatterPluginSettings,
	SampleSettingTab,
} from './settings';


function alignParagraph(editor: Editor, newTextAlign: string) {
	const selection = editor.getSelection();
	editor.replaceSelection(selection.replace(
		/^(?:<(?i:p)(?:\s+(?i:style)="\s*(.*?\s*)(;?\s*text-align:\s*.+?)?(;.+?)?;?\s*")?\s*>(.*?)<\/\s*(?i:p)\s*>|(.*?))$/gmu,
		(_match, preStyles = "", oldTextAlign = "", postStyles = "", tagContent = "", noTagContent = "") => {
			const alignPrefix = (oldTextAlign.startsWith(";") ? "; " : "");
			return `<p style="${preStyles}${alignPrefix}text-align: ${newTextAlign}${postStyles}">${noTagContent || tagContent}</p>`;
		},
	));
}


export default class SimpleFormatterPlugin extends Plugin {
	settings!: SimpleFormatterPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'align-to-left',
			name: 'Align line(s) to left',
			editorCallback: (editor: Editor) => alignParagraph(editor, "left"),
		});

		this.addCommand({
			id: 'align-to-center',
			name: 'Align line(s) to center',
			editorCallback: (editor: Editor) => alignParagraph(editor, "center"),
		});

		this.addCommand({
			id: 'align-to-right',
			name: 'Align line(s) to right',
			editorCallback: (editor: Editor) => alignParagraph(editor, "right"),
		});

		this.addCommand({
			id: 'align-to-justify',
			name: 'Justify line(s)',
			editorCallback: (editor: Editor) => alignParagraph(editor, "justify"),
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
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
