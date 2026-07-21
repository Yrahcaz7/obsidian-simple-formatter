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


export default class SimpleFormatterPlugin extends Plugin {
	settings!: SimpleFormatterPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'center-paragraph',
			name: 'Center paragraph',
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();
				editor.replaceSelection(selection.replace(
					/<(?i:p)\s+(.+\s+)?(?i:style)="\s*(.*?\s*)(;?\s*text-align:\s*.+?)?(;.+?)?;?\s*"(\s*.+?)?>(.+?)<\/(?i:p)>/gmu,
					(_match, preAttrs = "", preStyles = "", textAlign = "", postStyles = "", postAttrs = "", content = "") => {
						const alignPrefix = (textAlign.startsWith(";") ? "; " : "");
						return `<p ${preAttrs}style="${preStyles}${alignPrefix}text-align: center${postStyles}"${postAttrs}>${content}</p>`;
					},
				));
			},
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
