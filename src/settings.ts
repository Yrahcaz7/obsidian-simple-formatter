import { App, PluginSettingTab, Setting } from 'obsidian';
import SimpleFormatterPlugin from './main';

export interface SimpleFormatterPluginSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: SimpleFormatterPluginSettings = {
	mySetting: 'default',
};

export class SampleSettingTab extends PluginSettingTab {
	plugin: SimpleFormatterPlugin;

	constructor(app: App, plugin: SimpleFormatterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Settings #1')
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder('Enter your secret')
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
