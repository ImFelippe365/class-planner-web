import { GraduationCap } from "lucide-react";
import Dropdown from "./Dropdown";
import React from "react";

interface CourseCardProps {
	courseGrade: string;
	courseName: string;
	courseId: number;
	children: React.ReactNode;
}

export default function CourseCard({
	courseGrade,
	courseName,
	courseId,
	children,
}: CourseCardProps): React.ReactNode {
	return (
		<div
			className={`${
				courseGrade == "Ensino técnico"
					? "bg-ultra-violet-transparent"
					: "bg-coffee-transparent"
			} rounded-xl p-4 items-center`}
		>
			<div className="flex flex-row justify-between items-center">
				<GraduationCap
					width={29}
					height={29}
					color={`${
						courseGrade == "Ensino técnico" ? "#52489C" : "#6D4C3D"
					}`}
				/>

				<Dropdown cardType="course" courseId={courseId} courseGrade={courseGrade}>
					{children}
				</Dropdown>
			</div>

			<div
				className={`${
					courseGrade == "Ensino técnico"
						? "text-ultra-violet"
						: "text-coffee"
				} mt-3 h-20`}
			>
				<p className="text-xs">{courseGrade}</p>
				<p className="text-sm font-semibold mt-1 leading-4">{courseName}</p>
			</div>
		</div>
	);
}
