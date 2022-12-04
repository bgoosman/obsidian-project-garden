import React from "react";
import { Page, Task } from "../types";
import classNames from "classnames";

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
};

export const ProjectCard = ({
	className,
	page,
	topTasks,
	daysTilDue,
}: ProjectCardProps) => {
	const {
		file: {
			name,
			link: { path },
		},
		image,
		background,
	} = page;
	const areThereTasks = topTasks.length > 0;

	let borderColor = "green";
	if (daysTilDue <= 3) {
		borderColor = "red";
	} else if (daysTilDue <= 7) {
		borderColor = "orange";
	}

	return (
		<div
			className={classNames(
				"card w-96 bg-base-100 shadow-2xl overflow-hidden",
				`border-2 border-${borderColor}`,
				`hover:shadow-md hover:shadow-slate-900`,
				className
			)}
			style={{ borderColor }}
		>
			<a
				href={path}
				className="internal-link block h-36"
				style={{ background }}
			>
				{image && (
					<img
						src={image}
						className="card-img-top w-full h-full object-cover object-center"
					/>
				)}
			</a>
			<div className="card-body">
				<h1 className="card-title">
					<a href={path} className="internal-link">
						{name}
					</a>
				</h1>
				{areThereTasks && (
					<ul>
						{topTasks.map((task) => (
							<li key={task.text}>
								{task.text.split(" ").slice(1).join(" ")}
							</li>
						))}
					</ul>
				)}
				{!areThereTasks && <p>Nothing to do! 😄</p>}
				{/* <div className="card-actions justify-end">
					<button className="btn btn-primary">Buy Now</button>
				</div> */}
			</div>
		</div>
	);
};
