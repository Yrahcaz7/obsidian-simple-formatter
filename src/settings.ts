import { App, PluginSettingTab, Setting } from 'obsidian';
import SimpleFormatterPlugin from './main';

export interface SimpleFormatterPluginSettings {
	sectionBreak: string;
	sectionBreakAlign: string;
}

export const DEFAULT_SETTINGS: SimpleFormatterPluginSettings = {
	sectionBreak: '⁂',
	sectionBreakAlign: 'center',
};

export class SimpleFormatterSettingTab extends PluginSettingTab {
	plugin: SimpleFormatterPlugin;

	constructor(app: App, plugin: SimpleFormatterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl('h2', { text: 'Section breaks' });

		new Setting(containerEl)
			.setName('Section break indicator')
			.setDesc('The characters inserted by the "Insert section break" command. Defaults to "⁂".')
			.addText(text =>
				text
					.setPlaceholder('Enter indicator here')
					.setValue(this.plugin.settings.sectionBreak)
					.onChange(async value => {
						this.plugin.settings.sectionBreak = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Section break alignment')
			.setDesc('The alignment of section breaks inserted by the "Insert section break" command.')
			.addDropdown(dropdown =>
				dropdown
					.addOption('left', 'Left')
					.addOption('center', 'Center')
					.addOption('right', 'Right')
					.setValue(this.plugin.settings.sectionBreakAlign)
					.onChange(async value => {
						this.plugin.settings.sectionBreakAlign = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
