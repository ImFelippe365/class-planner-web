import { GraduationCap } from "lucide-react";
import Dropdown from "./Dropdown";

interface CourseCardProps {
	courseGrade: string;
	courseName: string;
}

export default function CourseCard({
	courseGrade,
	courseName,
}: CourseCardProps): React.ReactNode {
	return (
		<div
			className={`${
				courseGrade == "Técnico Integrado"
					? "bg-ultra-violet-transparent"
					: "bg-coffee-transparent"
			} rounded-xl p-4 items-center`}
		>
			<div className="flex flex-row justify-between items-center">
				<GraduationCap
					width={29}
					height={29}
					color={`${
						courseGrade == "Técnico Integrado" ? "#52489C" : "#6D4C3D"
					}`}
				/>

				<Dropdown cardType="course" courseGrade={courseGrade}/>
			</div>

			<div
				className={`${
					courseGrade == "Técnico Integrado"
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
