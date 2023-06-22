"use client";

import { MoreVertical } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Users } from "lucide-react";
import { Edit2 } from "lucide-react";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CourseCardProps {
	courseGrade: string;
	courseName: string;
}

export default function CourseCard({
	courseGrade,
	courseName,
}: CourseCardProps): React.ReactNode {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			className={`${
				courseGrade == "Técnico Integrado"
					? "bg-ultra-violet-transparent"
					: "bg-coffee-transparent"
			} rounded-xl w-56 p-4 items-center`}
		>
			<div className="flex flex-row justify-between items-center">
				<GraduationCap
					width={29}
					height={29}
					color={`${
						courseGrade == "Técnico Integrado" ? "#52489C" : "#6D4C3D"
					}`}
				/>

				<div className="relative">
					<button
						className="outline-none flex"
						onClick={() => setIsOpen((prev) => !prev)}
					>
						<MoreVertical
							width={18}
							height={18}
							color={`${
								courseGrade == "Técnico Integrado" ? "#52489C" : "#6D4C3D"
							}`}
							className="self-center"
						/>
					</button>

					{isOpen && (
						<div className="bg-white absolute top-5 flex flex-col items-start rounded-lg shadow-md p-3 w-40 left-[60%]">
							<Link href={`#`} className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
								<BookOpen width={16} height={16} color="#000E1A" />
								<p className="font-semibold text-xs">Ver disciplinas</p>
							</Link>

							<Link href={`#`} className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
								<Users width={16} height={16} color="#000E1A" />
								<p className="font-semibold text-xs">Ver turmas</p>
							</Link>

							<Link href={`#`} className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
								<Edit2 width={16} height={16} color="#000E1A" />
								<p className="font-semibold text-xs">Editar</p>
							</Link>

							<button className="flex flex-row w-full hover:bg-error-transparent rounded-lg cursor-pointer gap-3 items-center p-2">
								<Trash width={16} height={16} color="#C92A2A" />
								<p className="font-semibold text-xs text-error">Remover</p>
							</button>
						</div>
					)}
				</div>
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
