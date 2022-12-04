import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from 'react-dom/client';
import {
	GardenContainer
} from './GardenContainer'

export const GARDEN_VIEW_TYPE = 'project-garden'

export class GardenView extends ItemView {
  reactRoot: Root;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.navigation = true;
  }

	getViewType(): string {
		return GARDEN_VIEW_TYPE;
	}

	getDisplayText(): string {
		return 'Project Garden';
	}

  async onOpen() {
    this.reactRoot = createRoot(this.containerEl.children[1]);
    this.reactRoot.render(
      <React.StrictMode>
        <GardenContainer app={app} />
      </React.StrictMode>
    );
  }

  async onClose() {
    this.reactRoot.unmount();
  }
}