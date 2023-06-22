import { ChevronRight, User } from "lucide-react";
import Image from "next/image";

interface TeacherCardProps {
	teacherId: number | string;
	registration: string;
	name: string;
}

export default function TeacherCard({ 
	teacherId, 
	registration,
	name 
}: TeacherCardProps) {
	return (
		<div className="bg-white flex flex-row justify-between items-center max-w-sm py-4 px-4 rounded-2xl drop-shadow-sm">
			<div className="flex gap-x-4">
				<User className="rounded-lg bg-primary-background w-12 h-12 p-3" color="#007EA7"/>

				<div className="flex flex-col gap-y-1">
					<p className="text-primary font-semibold text-base">{name}</p>
					<p className="font-semibold text-placeholder text-xs">Matrícula: <span className="font font-normal">{registration}</span></p>
				</div>
			</div>

			<a href=""><ChevronRight className="bg-primary-background rounded-full" color="#007EA7" /></a>
		</div>
	)
}