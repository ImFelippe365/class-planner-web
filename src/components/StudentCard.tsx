"use client"

import { useState } from "react";
import { Crown, User, MoreVertical } from "lucide-react";
import Image from "next/image";

interface StudentCardProps {
	studentId: number | string;
	registration: string;
	name: string;
	courseNickname: string;
	courseGrade: string;
	classPeriod: string | number;
	isClassLeader?: boolean;
}

export default function StudentCard({
	studentId,
	registration,
	name,
	courseNickname,
	courseGrade,
	classPeriod,
	isClassLeader
}: StudentCardProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="bg-white flex flex-row justify-between items-center max-w-sm py-4 px-4 rounded-2xl drop-shadow-sm	">
			<div className="flex gap-x-4">
				<User className="rounded-lg bg-primary-background w-12 h-12 p-3" color="#007EA7" />

				<div className="flex flex-col gap-y-[2px]">
					<div className="flex items-center">
						<p className="text-primary font-semibold text-base">
							{name}
							{isClassLeader && (
								<span className="font font-normal text-xs"> Líder</span>
							)}
						</p>
					</div>

					<p className="font-semibold text-placeholder text-xs">Matrícula: <span className="font font-normal">{registration}</span></p>
					<p className="font-semibold text-placeholder text-xs">
						{courseNickname} | {classPeriod}º {courseGrade == "Técnico Integrado" ? "Ano" : "Período"}
					</p>
				</div>
			</div>

			{!isClassLeader && (
				<div className="relative">
					<button onClick={() => setIsOpen((prev) => !prev)} className="ouline-none">
						<MoreVertical className={`hover:bg-primary-background p-1 ${isOpen ? "bg-primary-background" : ""} rounded-full`} width={30} height={30} color="#007EA7" />
					</button>

					{isOpen && (
						<div className="bg-white absolute top-5 flex flex-col items-start rounded-lg p-3 left[65%] w-56 drop-shadow-sm">
							<div className="flex flex-row w-full hover:bg-primary-background rounded-lg cursor-pointer gap-3 items-center p-2">
								<Crown width={15} height={15} color="#007EA7" />
								<p className="font-semibold text-xs text-primary">Promover a líder de turma</p>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}