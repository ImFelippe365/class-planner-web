import React from "react";
import { AtSign, Mail, Clock } from "lucide-react";

interface AboutTeacherProps{
	registration: string | number;
	email: string;
	weekHours: string | number;
}

export default function AboutTeacher({
	registration,
	email,
	weekHours
}: AboutTeacherProps): React.ReactNode {
	return(
		<div className="bg-white text-primary-dark w-64 shadow rounded-2xl p-6">
			<p className="font-semibold mb-2">Sobre</p>

			<div className="">
				<div className="flex items-center gap-x-2">
					<AtSign className="w-4 h-4 text-primary-dark" />
					<span>{registration}</span>
				</div>

				<div className="flex items-center gap-x-2">
					<Mail className="w-4 h-4 text-primary-dark" />
					<span>{email}</span>
				</div>

				<div className="flex items-center gap-x-2">
					<Clock className="w-4 h-4 text-primary-dark"/>
					<span>{weekHours}aulas/semana</span>
				</div>
			</div>
		</div>
	)
}