"use client";

import { Users } from "lucide-react";
import Link from "next/link";

interface ClassCardProps {
	period: string | number;
	courseNickname: string;
	courseGrade: string;
	href: string
}

export default function ClassCard({
	period,
	courseNickname,
	courseGrade,
	href
}: ClassCardProps): React.ReactNode {
	return (
		<Link href={href} className="bg-primary-background rounded-xl p-4 items-center drop-shadow-sm w-52">
			<div className="flex flex-row justify-between">
				<Users width={24} height={24} color="#007EA7" />
			</div>

			<div className="text-primary mt-3 h-fit">
				<p className="text-xs">
					{period}º {courseGrade == "Ensino técnico" ? "Ano" : "Período"}
				</p>
				<p className="text-sm font-semibold mt-1 leading-4">{courseNickname}</p>
			</div>
		</Link>
	);
}
