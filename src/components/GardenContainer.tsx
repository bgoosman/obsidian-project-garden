import * as React from "react";
import { ProjectCard, ProjectCardProps } from "./ProjectCard";
import { cmpDateAsc, daysTil, getTaskDate, MAX_TIMESTAMP } from "../datetime";
import { cmpPriorityAsc, getTaskPriority } from "../task";
import { Page, Task } from "../types";

// @ts-ignore
import logoUrl from "../static/garden-transparent.png";

export type AppProps = {};

const Logo = ({ className }: { className?: string }) => (
	<img src={logoUrl} alt="Garden" className={className} />
);

export const GardenContainer = ({}: AppProps) => {
	const dv = app.plugins.plugins.dataview.api;

	// First create a project for each page in Projects/
	const projects = Array.from(dv.pages('"Projects"')).map(
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
			const projectPath = page.file.link.path
				.split("/")
				.map((p) => p.replace(".md", ""));
			const areThereTasks = topTasks.length > 0;
			const {
				file: {
					frontmatter: { image },
				},
			} = page;
			return {
				areThereTasks,
				daysTilDue,
				image,
				firstTaskDate,
				firstDueDate,
				hasDueDate,
				hasTasks: topTasks.length > 0,
				page,
				projectPath,
				topTasks,
			};
		}
	)
	.filter(props => props.projectPath.length <= 2)

	// Then sort the projects by due date
	const maxDaysTilDue = projects
		.filter((props) => props.hasDueDate)
		.map((props) => props.daysTilDue)
		.reduce((maxDays, days) => Math.max(maxDays, days), Infinity);
	projects.forEach((props) => (props.maxDaysTilDue = maxDaysTilDue));
	projects.sort((left, right) => {
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
				{projects.map((props) => (
					<ProjectCard
						className="mr-2 mb-3"
						key={props.page.file.link.path}
						{...props}
					/>
				))}
			</div>
		</div>
	);
};
