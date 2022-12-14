import { DateTime } from "luxon";
import "obsidian";

export type Task = {
	fullyCompleted: boolean;
	due: Date;
	start: Date;
	scheduled: Date;
	text: string;
};

export type PageLink = {
	name: string;
	path: string;
}

export type PageFile = {
	frontmatter: {
		image?: string;
	}
	name: string;
	tasks: Task[];
	link: PageLink;
  ctime: DateTime;
  mtime: DateTime;
  size: number;
  folder: string;
};

export type Page = {
	file: PageFile;
	image: string;
	background: string;
};

declare module "obsidian" {
	interface App {
		plugins: {
			plugins: {
				dataview: {
					api: {
						pages: (path: string) => Page[];
					};
				};
			};
		};
	}
}
