import { addIcon, Plugin } from 'obsidian';
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

		this.addCommand({
			id: 'open-project-garden',
			name: 'Open Project Garden',
			callback: () => {
				this.activateView();
			}
		});

		addIcon('project-garden', '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>');
		this.addRibbonIcon('project-garden', 'Project Garden', (evt: MouseEvent) => {
			this.activateView();
		});
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