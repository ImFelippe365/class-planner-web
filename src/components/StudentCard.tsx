import { User } from "lucide-react";
import Dropdown from "./Dropdown";
import { api } from "@/services/api";
import { toast } from "react-toastify";
import Image from "next/image";
interface StudentCardProps {
	studentId: number;
	registration: string;
	name: string;
	courseNickname: string;
	courseGrade: string;
	classPeriod: string | number;
	isClassLeader?: boolean;
	classId: number;
	studentAvatar?: string | undefined;
	refreshStudents: () => void;
}

export default function StudentCard({
	studentId,
	registration,
	name,
	courseNickname,
	courseGrade,
	classPeriod,
	isClassLeader,
	classId,
	studentAvatar,
	refreshStudents,
}: StudentCardProps) {
	const promoteToClassLeader = async () => {
		try {
			await api.patch(`classes/${classId}/`, {
				class_leader_id: studentId,
			});

			toast.success("Estudante promovido a líder da turma");
			refreshStudents()
		} catch {
			toast.error("Ocorreu um erro ao tentar definir líder da turma");
		}
	};

	return (
		<div className="bg-white flex flex-row justify-between items-center max-w-sm py-4 px-4 rounded-2xl drop-shadow-sm	">
			<div className="flex gap-x-4">
				{studentAvatar ? (
					<div className="relative w-12 h-12">
						<Image
							fill
							alt={name}
							src={`https://suap.ifrn.edu.br${studentAvatar}`}
							className="rounded-lg object-cover"
						/>
					</div>
				) : (
					<User
						className="rounded-lg bg-primary-background w-12 p-3 h-fit"
						color="#007EA7"
					/>
				)}

				<div className="flex flex-col gap-y-[2px]">
					<div className="flex items-center">
						<p className="text-primary gap-4 font-semibold text-base">
							{name}
							{isClassLeader && (
								<span className="font font-normal text-xs ml-1"> Líder</span>
							)}
						</p>
					</div>

					<p className="font-semibold text-placeholder text-xs">
						Matrícula: <span className="font font-normal">{registration}</span>
					</p>
					<p className="font-semibold text-placeholder text-xs">
						{courseNickname} | {classPeriod}º{" "}
						{courseGrade == "Técnico Integrado" ? "Ano" : "Período"}
					</p>
				</div>
			</div>

			{!isClassLeader && (
				<Dropdown
					onPromoteToClassLeader={() => promoteToClassLeader()}
					cardType="student"
				/>
			)}
		</div>
	);
}
