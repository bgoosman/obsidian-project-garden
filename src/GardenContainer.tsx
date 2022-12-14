import { App } from "obsidian";
import * as React from "react";
import { ProjectCard, ProjectCardProps } from "./components/ProjectCard";
import { cmpDateAsc, daysTil, getTaskDate, MAX_TIMESTAMP } from "./dateTime";
import logoUrl from "./static/garden-transparent.png";
import { cmpPriorityAsc, getTaskPriority } from "./task";
import { OpenPath, Page, Task } from "./types";

export type AppProps = {
	app: App;
	openPath: OpenPath;
	onClickProject: (file: Page) => void;
};

const Logo = ({ className }: { className?: string }) => (
	<img src={logoUrl} alt="Garden" className={className} />
);

export const GardenContainer = ({ app, openPath, onClickProject }: AppProps) => {
	const dv = app.plugins.plugins.dataview.api;
	const cardProps = Array.from(dv.pages('"Projects"')).map(
		(page: Page): ProjectCardProps => {
			const tasksArray = Array.from(page.file.tasks);
			const topTasks = tasksArray
				.map((task: Task) => {
					return {
						...task,
						done: task.fullyCompleted,
						notDone: !task.fullyCompleted,
						hasDueDate: !!task.due,
						start: task.start ?? MAX_TIMESTAMP,
						date: getTaskDate(task),
						hasDate: task.scheduled || task.start || task.due,
						priority: getTaskPriority(task),
					};
				})
				.filter((task) => task.notDone)
				.sort((left, right) => {
					const cmpDate = cmpDateAsc(left.date, right.date);
					const cmpPriority = cmpPriorityAsc(
						left.priority,
						right.priority
					);
					return left.hasDate || right.hasDate
						? cmpDate
						: cmpPriority;
				})
				.slice(0, 3);
			const firstTaskDate = topTasks[0]?.date;
			const firstDueDate = topTasks[0]?.due;
			const hasDueDate = !!firstDueDate;
			const daysTilDue = hasDueDate ? daysTil(firstDueDate) : Infinity;
			const props = {
				page,
				topTasks,
				hasTasks: topTasks.length > 0,
				firstTaskDate,
				firstDueDate,
				hasDueDate,
				daysTilDue,
				openPath,
				onClickProject,
				app,
			};
			return props;
		}
	);

	const maxDaysTilDue = cardProps
		.filter((props) => props.hasDueDate)
		.map((props) => props.daysTilDue)
		.reduce((maxDays, days) => Math.max(maxDays, days), Infinity);
	cardProps.forEach((props) => (props.maxDaysTilDue = maxDaysTilDue));

	cardProps.sort((left, right) => {
		if (left.hasTasks && right.hasTasks) {
			return cmpDateAsc(left.firstTaskDate, right.firstTaskDate);
		} else {
			return left.hasTasks && !right.hasTasks ? -1 : 1;
		}
	});

	return (
		<div className="project-garden" data-theme="cyberpunk">
			<div className="navbar bg-base-100 mb-4 flex-grow-0">
				<div className="flex-1">
					<Logo className="mr-4 h-14 overflow-hidden rounded-2xl shadow-sm shadow-cyan-500/50" />
					<h1 className="text-4xl">project garden</h1>
				</div>
			</div>
			<div className="flex flex-wrap">
				{cardProps.map((props) => {
					const key = props.page.file.link.path;
					return (
						<ProjectCard
							className="mr-2 mb-3"
							key={key}
							{...props}
						/>
					);
				})}
			</div>
		</div>
	);
};
