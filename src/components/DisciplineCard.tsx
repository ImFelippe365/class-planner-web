import { BookOpen } from "lucide-react";
import Dropdown from "./Dropdown";
import React from "react";

interface DisciplineCardProps {
	disciplineId: number;
	period: string | number;
	name: string;
	courseGrade: string | undefined;
	courseId?: number;
	children?: React.ReactNode;
	isOptional: boolean
	courseByname?: string;
}

export default function DisciplineCard({
	disciplineId,
	period,
	name,
	courseGrade,
	courseId,
	children,
	isOptional,
	courseByname,
}: DisciplineCardProps): React.ReactNode {
	return (
		<div className="bg-primary-background rounded-xl p-4 items-center w-52">
			<div className="flex flex-row justify-between">
				<BookOpen width={24} height={24} color="#007EA7" />

				<Dropdown cardType="discipline" courseId={courseId} disciplineId={disciplineId}>
					{children}
				</Dropdown>
			</div>

			<div className="text-primary mt-3 h-20 text-xs">
				{isOptional ?
					(<p>Optativa {courseByname && `| ${courseByname}`}</p>)
					: (<p>{period}º {courseGrade == "Ensino técnico" ? "Ano" : "Período"} {courseByname && `| ${courseByname}`}</p>)
				}
				<p className="text-sm font-semibold mt-1 leading-4">{name}</p>
			</div>
		</div>
	);
}
