import { App, PluginSettingTab, Setting } from 'obsidian';
import SimpleFormatterPlugin from './main';

export interface SimpleFormatterPluginSettings {
	htmlMode: boolean;
	indentAmount: number;
	sectionBreak: string;
	sectionBreakAlign: string;
}

export const DEFAULT_SETTINGS: SimpleFormatterPluginSettings = {
	htmlMode: true,
	indentAmount: 2,
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

		new Setting(containerEl).setName('General').setHeading();

		new Setting(containerEl)
			.setName('HTML Mode')
			.setDesc('When enabled, uses HTML paragraphs for alignment and indentation. This has greater cross-compatability than the default, but it disallows Markdown syntax inside aligned and indented blocks.')
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.htmlMode)
					.onChange(async value => {
						this.plugin.settings.htmlMode = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl).setName('Indentation').setHeading();

		new Setting(containerEl)
			.setName('Indentation amount')
			.setDesc('The amount of indentation used by the "Indent/Unindent line(s)" commands.')
			.addSlider(text =>
				text
					.setLimits(1, 4, 0.5)
					.setDynamicTooltip()
					.setValue(this.plugin.settings.indentAmount)
					.onChange(async value => {
						this.plugin.settings.indentAmount = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl).setName('Section breaks').setHeading();

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
			.setDesc('The alignment of the characters inserted by the "Insert section break" command.')
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
