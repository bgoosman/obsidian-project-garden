import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { App, Vault } from "obsidian";
import * as React from "react";
import { OnClickProject, OpenPath, Page, PageLink, Task } from "../types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export type ProjectCardProps = {
	className?: string;
	page: Page;
	topTasks: Task[];
	hasTasks: boolean;
	firstTaskDate: Date;
	firstDueDate: Date;
	hasDueDate: boolean;
	daysTilDue: number;
	maxDaysTilDue?: number;
	onClickProject: OnClickProject;
	openPath: OpenPath;
	app: App;
};

type TaskItemProps = {
	projectPath: string[];
	task: Task;
	openPath: OpenPath;
	app: App;
};

const TaskItem = ({ openPath, projectPath, task, app }: TaskItemProps) => {
	const taskText = task.text;
	const taskTextWithoutTags = taskText.replace(/#\w+/g, "").trim();
	const taskTextWithoutTagsAndDates = taskTextWithoutTags.replace(/\d{4}-\d{2}-\d{2}/g, "").trim();
	const taskTextWithoutTagsAndDatesAndDateIcons = taskTextWithoutTagsAndDates.replace(/(📅|🛫)/g, "").trim()
	const taskTextWithoutTagsAndDatesAndDateIconsAndPriorityIcons = taskTextWithoutTagsAndDatesAndDateIcons.replace(/(⏫|🔼|🔽)/g, "").trim()
	const taskTextWithoutTagsAndDatesAndDateIconsAndPriorityIconsAndBrackets = taskTextWithoutTagsAndDatesAndDateIconsAndPriorityIcons.replace("[[", "").replace("]]", "").trim()

	const makePageLink = (linkText: string): PageLink => ({
		name: linkText,
		path: `${projectPath.join('/')}/${linkText}.md`,
	});

	const pageLink = makePageLink(taskTextWithoutTagsAndDatesAndDateIconsAndPriorityIconsAndBrackets);
	const doesPathExist = app.vault.getAbstractFileByPath(pageLink.path)
	return (
		<span
			className={classNames("cursor-pointer")}
			style={{
				color: "var(--link-external-color)",
				opacity: doesPathExist ? 1 : 0.5,
				textDecorationLine: "var(--link-external-decoration)",
				filter: "var(--link-external-filter)",
			}}
			onClick={() => openPath(pageLink)}
		>
			{taskTextWithoutTagsAndDatesAndDateIconsAndPriorityIconsAndBrackets}
		</span>
	);
};

export const ProjectCard = ({
	className,
	page,
	topTasks,
	daysTilDue,
	openPath,
	onClickProject,
	app,
}: ProjectCardProps) => {
	const {
		file: {
			link: { path },
			frontmatter: { image },
		},
	} = page;
	const projectPath = path.split("/").map((p) => p.replace(".md", ""));
	const areThereTasks = topTasks.length > 0;

	let borderColor = "green";
	if (daysTilDue <= 3) {
		borderColor = "red";
	} else if (daysTilDue <= 7) {
		borderColor = "orange";
	}

	let backgroundStyle: React.CSSProperties = {};
	if (image) {
		backgroundStyle = {
			backgroundImage: `url(${image})`,
		};
	}

	return (
		<div
			className={classNames(
				"card w-96 bg-base-100 overflow-hidden",
				`border-2 border-${borderColor}`,
				`hover:shadow-md hover:shadow-slate-900`,
				className
			)}
			style={{ borderColor }}
		>
			<div
				style={{ ...backgroundStyle }}
				className={classNames(
					"card-img-top w-full h-48 bg-cover bg-center bg-no-repeat py-6 px-8 border-b-2 border-slate-300",
					"cursor-pointer"
				)}
				onClick={() => onClickProject(page)}
			>
				<h1
					className={classNames(
						"font-bold text-lg text-white mb-2 mix-blend-exclusion"
					)}
				>
					{projectPath.slice(1).map((x, i) => (
						<>
							{i > 0 && <ChevronDoubleRightIcon className="inline-block w-3 h-3 mx-2" />}
							{x}
						</>
					))}
				</h1>
				<ProjectStatusBadge
					daysTilDue={daysTilDue}
					taskCount={topTasks.length}
				/>
			</div>
			{areThereTasks && (
				<div className="card-body p-6">
					<ul>
						{topTasks.map((task) => {
							return (
								<li
									key={task.text}
									className={classNames(
										"list-decimal list-inside"
									)}
								>
									<TaskItem
										app={app}
										openPath={openPath}
										task={task}
										projectPath={projectPath}
									/>
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</div>
	);
};
