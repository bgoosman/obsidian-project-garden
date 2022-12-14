import { App, ItemView, TFile, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { GardenContainer } from "./GardenContainer";
import { PageLink } from "../types";

export const GARDEN_VIEW_TYPE = "project-garden";

export type PluginContextType = {
	app: App;
	leaf: WorkspaceLeaf;
} | null;

let pluginContext: PluginContextType = null;

export const PluginContext = React.createContext<PluginContextType>(null);

export const openPage = async (link: PageLink) => {
	const {
		leaf,
		app: { vault },
	} = pluginContext!;
	const file: TFile = {
		vault: vault,
		name: link.name,
		path: link.path,
		basename: link.name,
		extension: "md",
	} as unknown as TFile;
	try {
		await vault.createFolder(file.path.slice(0, -1));
		await vault.create(file.path, "");
	} catch (e) {}
	console.log("Opening page", file);
	await leaf.openFile(file, { active: true });
};

export class GardenView extends ItemView {
	reactRoot: Root;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.navigation = true;
		this.icon = "project-garden";
	}

	getViewType(): string {
		return GARDEN_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Project Garden";
	}

	async onOpen() {
		pluginContext = {
			app: this.app,
			leaf: this.leaf,
		};
		this.reactRoot = createRoot(this.containerEl.children[1]);
		this.reactRoot.render(
			<React.StrictMode>
				<PluginContext.Provider value={pluginContext}>
					<GardenContainer />
				</PluginContext.Provider>
			</React.StrictMode>
		);
	}

	async onClose() {
		this.reactRoot.unmount();
	}
}
