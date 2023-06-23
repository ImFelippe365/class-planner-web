import { User } from "lucide-react";
import Dropdown from "./Dropdown";

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
				<Dropdown cardType="student"/>
			)}
		</div>
	)
}