import { App, PluginSettingTab, Setting, SettingDefinitionItem, SettingGroup } from 'obsidian';
import SimpleFormatterPlugin from './main';

export interface SimpleFormatterPluginSettings {
	htmlMode: boolean;
	indentAmount: number;
	sectionBreak: string;
	sectionBreakAlign: string;
}

export const DEFAULT_SETTINGS: SimpleFormatterPluginSettings = {
	htmlMode: false,
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

	getSettingDefinitions(): SettingDefinitionItem<'htmlMode' | 'indentAmount' | 'sectionBreak' | 'sectionBreakAlign'>[] {
		return [{
			name: 'HTML mode',
			desc: 'When enabled, HTML paragraphs are used for alignment and indentation. This has greater cross-compatability than the default, but it disallows Markdown syntax inside aligned and indented blocks. It also changes how such blocks are displayed in editing mode. (This only changes new placements, not old ones.)',
			control: { type: 'toggle', key: 'htmlMode' },
		}, {
			type: 'group',
			heading: 'Indentation',
			items: [{
				name: 'Indentation amount',
				desc: 'The amount of indentation used by the "indent/unindent line(s)" commands.',
				control: { type: 'slider', key: 'indentAmount', min: 1, max: 4, step: 0.5 },
			}],
		}, {
			type: 'group',
			heading: 'Section breaks',
			items: [{
				name: 'Section break indicator',
				desc: 'The characters inserted by the "insert section break" command. Defaults to "⁂".',
				control: { type: 'text', key: 'sectionBreak', placeholder: 'Enter indicator here' },
			}, {
				name: 'Section break alignment',
				desc: 'The alignment of the characters inserted by the "insert section break" command.',
				control: {
					type: 'dropdown',
					key: 'sectionBreakAlign',
					options: { left: 'Left', center: 'Center', right: 'Right' },
				},
			}],
		}];
	}

	display() {
		this.containerEl.empty();

		new Setting(this.containerEl)
			.setName('HTML mode')
			.setDesc('When enabled, HTML paragraphs are used for alignment and indentation. This has greater cross-compatability than the default, but it disallows Markdown syntax inside aligned and indented blocks. It also changes how such blocks are displayed in editing mode. (This only changes new placements, not old ones.)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.htmlMode)
				.onChange(async value => {
					this.plugin.settings.htmlMode = value;
					await this.plugin.saveSettings();
				}),
			)

		const indentationGroup = new SettingGroup(this.containerEl).setHeading('Indentation');

		indentationGroup.addSetting(setting => {
			setting
				.setName('Indentation amount')
				.setDesc('The amount of indentation used by the "indent/unindent line(s)" commands.')
				.addSlider(slider => slider
					// The dynamic tooltip is still needed here, as display() is only used on versions prior to 1.13,
					// and the inline display that replaces the tooltip was only added in version 1.13
					.setDynamicTooltip()
					.setLimits(1, 4, 0.5)
					.setValue(this.plugin.settings.indentAmount)
					.onChange(async value => {
						this.plugin.settings.indentAmount = value;
						await this.plugin.saveSettings();
					}),
				)
		});

		const sectionBreaksGroup = new SettingGroup(this.containerEl).setHeading('Section breaks');

		sectionBreaksGroup.addSetting(setting => {
			setting
				.setName('Section break indicator')
				.setDesc('The characters inserted by the "insert section break" command. Defaults to "⁂".')
				.addText(text => text
					.setPlaceholder('Enter indicator here')
					.setValue(this.plugin.settings.sectionBreak)
					.onChange(async value => {
						this.plugin.settings.sectionBreak = value;
						await this.plugin.saveSettings();
					}),
				)
		});
		sectionBreaksGroup.addSetting(setting => {
			setting
				.setName('Section break alignment')
				.setDesc('The alignment of the characters inserted by the "insert section break" command.')
				.addDropdown(dropdown => dropdown
					.addOption('left', 'Left')
					.addOption('center', 'Center')
					.addOption('right', 'Right')
					.setValue(this.plugin.settings.sectionBreakAlign)
					.onChange(async value => {
						this.plugin.settings.sectionBreakAlign = value;
						await this.plugin.saveSettings();
					}),
				)
		});
	}
}
