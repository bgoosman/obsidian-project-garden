import { compose } from "rambda";
import {
  ExclamationCircleIcon,
	ExclamationTriangleIcon,
	FaceSmileIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import classNames from "classnames";

export type ProjectStatusBadgeProps = {
	className?: string;
	daysTilDue: number;
	taskCount: number;
};
export const ProjectStatusBadge = ({ taskCount, className, daysTilDue }: ProjectStatusBadgeProps) => {
	const friendlyDaysTilDue = compose(Math.abs, Math.ceil)(daysTilDue);
  const iconClassName = classNames('w-5 h-5 mr-2');
	const content = (() => {
		if (taskCount == 0) {
			return {
				message: "Nothing to do",
				icon: <FaceSmileIcon className={classNames(iconClassName, 'text-green-500')} />,
			};
		}

		if (friendlyDaysTilDue === 0) {
			return {
				message: "Due today",
				icon: (
					<ExclamationTriangleIcon className={classNames(iconClassName, 'text-red-500')} />
				),
			};
		}

		if (friendlyDaysTilDue === 1) {
			return {
				message: "Due tomorrow",
				icon: (
					<ExclamationTriangleIcon className={classNames(iconClassName, 'text-orange-500')} />
				),
			};
		}

		if (friendlyDaysTilDue > 1 && friendlyDaysTilDue <= 7) {
			return {
				message: `Due in ${friendlyDaysTilDue} days`,
				icon: (
					<ExclamationCircleIcon className={classNames(iconClassName, 'text-yellow-500')} />
				),
			};
		}

		if (daysTilDue < 0) {
			return {
				message: `Overdue by ${friendlyDaysTilDue} days`,
				icon: (
					<ExclamationTriangleIcon className={classNames(iconClassName, 'text-red-500')} />
				),
			};
		}

		return {
			message: `No rush`,
			icon: <FaceSmileIcon className={classNames(iconClassName, 'text-green-500')} />,
		};
	})();
	return (
		<div className={classNames('badge badge-primary bg-slate-700 p-4', className)}>
			{content.icon}
			<span className={classNames('text-white')}>{content.message}</span>
		</div>
	);
};
