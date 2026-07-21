import { App, PluginSettingTab, Setting } from 'obsidian';
import SimpleFormatterPlugin from './main';

export interface SimpleFormatterPluginSettings {
	sectionBreak: string;
}

export const DEFAULT_SETTINGS: SimpleFormatterPluginSettings = {
	sectionBreak: '⁂',
};

export class SimpleFormatterSettingTab extends PluginSettingTab {
	plugin: SimpleFormatterPlugin;

	constructor(app: App, plugin: SimpleFormatterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Section break')
			.setDesc('The characters inserted with the "Insert section break" command')
			.addText(text =>
				text
					.setPlaceholder('Enter your section break indicator')
					.setValue(this.plugin.settings.sectionBreak)
					.onChange(async value => {
						this.plugin.settings.sectionBreak = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
