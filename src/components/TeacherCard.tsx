"use client"

import { ChevronRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TeacherCardProps {
	teacherId: number | string;
	registration: string;
	name: string;
	teacherAvatar?: string;
}

export default function TeacherCard({
	teacherId,
	registration,
	name,
	teacherAvatar
}: TeacherCardProps) {
	return (
		<div className="bg-white flex flex-row justify-between items-center max-w-md py-4 px-4 rounded-2xl drop-shadow-sm">
			<div className="flex gap-x-4">

				{teacherAvatar ? (
					<Image
						width={48}
						height={48}
						alt={name}
						src={`https://suap.ifrn.edu.br${teacherAvatar}`}
						className="rounded-lg"
					/>
				) : (
					<User className="rounded-lg bg-primary-background w-12 p-3 h-fit" color="#007EA7" />

				)}

				<div className="flex flex-col gap-y-1">
					<p className="text-primary font-semibold text-base">{name}</p>
					<p className="font-semibold text-placeholder text-xs">Matrícula: <span className="font font-normal">{registration}</span></p>
				</div>
			</div>

			<Link href={`/professores/${teacherId}`}>
				<ChevronRight className="bg-primary-background rounded-full" color="#007EA7" />
			</Link>
		</div>
	)
}