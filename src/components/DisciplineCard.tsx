"use client";

import { MoreVertical } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Edit2 } from "lucide-react";
import { Trash } from "lucide-react";
import { useState } from "react";

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
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="bg-primary-background rounded-xl w-56 p-4 items-center">
			<div className="flex flex-row justify-between">
				<BookOpen width={24} height={24} color="#007EA7" />
				<div className="relative">
					<button
						className="outline-none flex"
						onClick={() => setIsOpen((prev) => !prev)}
					>
						<MoreVertical width={18} height={18} color="#007EA7" />
					</button>

					{isOpen && (
						<div className="bg-white absolute top-5 flex flex-col items-start rounded-lg shadow-md p-3 w-40 left-[60%]">
							<div className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
								<Edit2 width={16} height={16} color="#000E1A" />
								<p className="font-semibold text-xs">Editar</p>
							</div>

							<div className="flex flex-row w-full hover:bg-error-transparent rounded-lg cursor-pointer gap-3 items-center p-2">
								<Trash width={16} height={16} color="#C92A2A" />
								<p className="font-semibold text-xs text-error">Remover</p>
							</div>
						</div>
					)}
				</div>
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
