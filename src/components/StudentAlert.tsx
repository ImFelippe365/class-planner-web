import { formatDisciplineName } from "@/utils/formatDisciplineName";
import { User } from "lucide-react";
import React from "react";

interface StudentAlertProps {
	student: {
		name: string;
		avatar: string;
		courseName: string;
	};
	teacher: {
		name: string;
		avatar: string;
	};
	publishDate: string;
	disciplineName: string;
	reason?: string;
}

export default function StudentAlert({
	student,
	teacher,
	disciplineName,
	reason,
	publishDate,
}: StudentAlertProps) {
	const date = new Date(publishDate).toLocaleTimeString("pt-BR", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="mt-4">
			<section className="flex items-center gap-3">
				<div className="w-10 h-10 flex justify-center items-center rounded-full bg-primary-background">
					<User className="text-primary" />
				</div>
				<div className="leading-none">
					<h3 className="text-black text-base font-bold leading-none">
						{student.name}
						<span className="text-xs font-normal ml-1">{date}</span>
					</h3>
					<span className="text-gray text-xs">{student.courseName}</span>
				</div>
			</section>
			<section className="ml-11 mt-3 bg-white p-4 rounded-lg">
				<p className="text-gray text-sm">
					<span className="font-bold">{teacher.name}</span> na disciplina{" "}
					<span className="font-bold">
						{formatDisciplineName(disciplineName)}
					</span>
				</p>
				<br />
				{reason ? (
					<p className="text-gray text-sm">&quot;{reason}&quot;</p>
				) : (
					<p className="text-gray text-sm font-bold">Sem motivo cadastrado</p>
				)}
			</section>
		</div>
	);
}
