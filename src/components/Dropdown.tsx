"use client";

import { useState } from "react"
import { BookOpen, Users, Edit2, Trash, Crown } from "lucide-react";
import Link from "next/link";
import { MoreVertical } from "lucide-react"

interface DropdownProps {
	cardType: "discipline" | "course" | "student";
	courseGrade?: string;
}

export default function Dropdown({ cardType, courseGrade }: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<button
				className="outline-none flex"
				onClick={() => setIsOpen(!isOpen)}
			>
				{cardType != 'student' ? (
					<MoreVertical
						width={18}
						height={18}
						color={`${cardType == 'discipline' ? "#007EA7" :
							courseGrade == "Técnico Integrado" ? "#52489C" : "#6D4C3D"}`}
						className="self-center"
					/>
				)
					: <MoreVertical className={`hover:bg-primary-background p-1 ${isOpen && "bg-primary-background"} rounded-full`} width={30} height={30} color="#007EA7" />
				}
			</button>

			{isOpen && (
				<>
					{cardType != 'student' ? (
						<div className="bg-white absolute top-4 flex flex-col items-start rounded-lg drop-shadow-md p-3 w-40 right-[0]">

							{cardType == 'course' && (
								<>
									<Link href={`#`} className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
										<BookOpen width={16} height={16} color="#000E1A" />
										<p className="font-semibold text-xs">Ver disciplinas</p>
									</Link>

									<Link href={`#`} className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
										<Users width={16} height={16} color="#000E1A" />
										<p className="font-semibold text-xs">Ver turmas</p>
									</Link>
								</>
							)}

							<Link href={`#`} className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
								<Edit2 width={16} height={16} color="#000E1A" />
								<p className="font-semibold text-xs">Editar</p>
							</Link>

							<Link href={`#`} className="flex flex-row w-full hover:bg-error-transparent rounded-lg cursor-pointer gap-3 items-center p-2">
								<Trash width={16} height={16} color="#C92A2A" />
								<p className="font-semibold text-xs text-error">Remover</p>
							</Link>
						</div>
					) : (
						<div className="bg-white absolute top-5 flex flex-col items-start rounded-lg p-3 right-[0] w-56 drop-shadow-sm">
							<div className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
								<Crown width={15} height={15} color="#007EA7" />
								<p className="font-semibold text-xs text-primary">Promover a líder de turma</p>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}