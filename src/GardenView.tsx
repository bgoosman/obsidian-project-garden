import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { GardenContainer } from "./GardenContainer";
import { Page, PageLink } from "./types";

export const GARDEN_VIEW_TYPE = "project-garden";

export class GardenView extends ItemView {
	reactRoot: Root;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.navigation = true;
    this.icon = 'project-garden'
	}

	getViewType(): string {
		return GARDEN_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Project Garden";
	}

	async onOpen() {
		this.reactRoot = createRoot(this.containerEl.children[1]);
		this.reactRoot.render(
			<React.StrictMode>
				<GardenContainer
					app={this.app}
          openPath={async (link: PageLink) => {
						const file: TFile = {
							vault: this.app.vault,
              name: link.name,
							path: link.path,
              basename: link.name,
							extension: "md",
						} as unknown as TFile;
            try {
              await this.app.vault.createFolder(file.path.slice(0, -1));
              await this.app.vault.create(file.path, '');
            } catch (e) {}
            console.log('openPath', file);
						await this.leaf.openFile(file, { active: true, });
          }}
					onClickProject={async (page: Page) => {
						const file: TFile = {
							vault: this.app.vault,
              name: page.file.name,
							path: page.file.link.path,
							basename: page.file.name,
							extension: "md",
						} as unknown as TFile;
						await this.leaf.openFile(file, {
							active: true,
						});
					}}
				/>
			</React.StrictMode>
		);
	}

	async onClose() {
		this.reactRoot.unmount();
	}
}
