import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { GardenView, GARDEN_VIEW_TYPE } from './GardenView';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class ProjectGarden extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(GARDEN_VIEW_TYPE, (leaf) => new GardenView(leaf));

		this.addRibbonIcon('dice', 'Project Garden', (evt: MouseEvent) => {
			this.activateView();
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new ProjectGardenSettingTab(this.app, this));
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(GARDEN_VIEW_TYPE);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(GARDEN_VIEW_TYPE);

		await this.app.workspace.getLeaf(true).setViewState({
			type: GARDEN_VIEW_TYPE,
			active: true,
		});

		this.app.workspace.revealLeaf(this.app.workspace.getLeavesOfType(GARDEN_VIEW_TYPE)[0]);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ProjectGardenSettingTab extends PluginSettingTab {
	plugin: ProjectGarden;

	constructor(app: App, plugin: ProjectGarden) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
