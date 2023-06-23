import { BookOpen } from "lucide-react";
import Dropdown from "./Dropdown";

interface DisciplineCardProps {
	period: string | number;
	disciplineName: string;
	courseGrade: string;
}

export default function DisciplineCard({
	period,
	disciplineName,
	courseGrade,
}: DisciplineCardProps): React.ReactNode {
	return (
		<div className="bg-primary-background rounded-xl p-4 items-center">
			<div className="flex flex-row justify-between">
				<BookOpen width={24} height={24} color="#007EA7" />

				<Dropdown cardType="discipline" />
			</div>

			<div className="text-primary mt-3 h-20">
				<p className="text-xs">
					{period}º {courseGrade == "Técnico Integrado" ? "Ano" : "Período"}
				</p>
				<p className="text-sm font-semibold mt-1 leading-4">{disciplineName}</p>
			</div>
		</div>
	);
}
