import React, { useEffect, useState } from "react"
import { api } from "@/services/api"
import { AtSign, Clock, Mail } from "lucide-react";
import { Teacher } from "@/interfaces/Teacher";

interface TeacherInformationsProps {
	teacher: Teacher | undefined;
	quantityClasses: number;
}

export default function TeacherInformations({ teacher, quantityClasses }: TeacherInformationsProps): React.ReactNode {
	return (
		<div className="flex justify-between mt-3">
			<div className="flex items-center gap-x-1">
				<AtSign className="w-4 h-4 text-primary-dark" />
				<span>{teacher?.registration}</span>
			</div>

			<div className="flex items-center gap-x-1">
				<Mail className="w-4 h-4 text-primary-dark" />
				<span>{teacher?.email}</span>
			</div>

			<div className="flex items-center gap-x-1">
				<Clock className="w-4 h-4 text-primary-dark" />
				<span>{quantityClasses} aulas/semana</span>
			</div>
		</div>
	)
}