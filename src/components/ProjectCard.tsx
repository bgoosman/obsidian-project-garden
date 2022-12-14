import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import * as React from "react";
import { Page, PageLink, Task } from "../types";
import { openPage } from "./GardenView";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export type ProjectCardProps = {
	areThereTasks: boolean;
	className?: string;
	daysTilDue: number;
	firstTaskDate: Date;
	firstDueDate: Date;
	hasDueDate: boolean;
	hasTasks: boolean;
	image?: string;
	maxDaysTilDue?: number;
	page: Page;
	projectPath: string[];
	topTasks: Task[];
};

type TaskItemProps = {
	projectPath: string[];
	task: Task;
};

const TaskItem = ({ projectPath, task }: TaskItemProps) => {
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
				opacity: doesPathExist ? 1 : 0.7,
				textDecorationLine: "var(--link-external-decoration)",
				filter: "var(--link-external-filter)",
			}}
			onClick={() => openPage(pageLink)}
		>
			{taskTextWithoutTagsAndDatesAndDateIconsAndPriorityIconsAndBrackets}
		</span>
	);
};

export const ProjectCard = ({
	areThereTasks,
	className,
	daysTilDue,
	image,
	page,
	projectPath,
	topTasks,
}: ProjectCardProps) => {

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
	} else {
		backgroundStyle.background = `#d3e7e4`;
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
				onClick={() => openPage(page.file.link as unknown as PageLink)}
			>
				<h1
					className={classNames(
						"font-bold text-2xl text-white mb-2 mix-blend-exclusion"
					)}
				>
					{projectPath.slice(1).map((x, i) => (
						<span key={x}>
							{i > 0 && <ChevronDoubleRightIcon className="inline-block w-3 h-3 mx-2" />}
							{x}
						</span>
					))}
				</h1>
				<ProjectStatusBadge
					daysTilDue={daysTilDue}
					taskCount={topTasks.length}
				/>
			</div>
			{areThereTasks && (
				<div className="card-body p-6" style={{backgroundColor: `var(--background-secondary)`}}>
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
