"use client";

import Breadcrumb from "@/components/Breadcrumb";
import StudentAlert from "@/components/StudentAlert";
import { Alert } from "@/interfaces/Student";
import { api } from "@/services/api";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Alerts() {
	document.title = "Class Planner | Notificações";
	
	const [alerts, setAlerts] = useState<Alert[]>([]);

	const getStudentAlerts = async () => {
		const { data } = await api.get("alerts/");

		setAlerts(data);
	};

	useEffect(() => {
		getStudentAlerts();
	}, []);

	return (
		<div>
			<Breadcrumb title="Alertas" />

			{alerts.map((alert) => (
				<StudentAlert
					key={alert.id}
					disciplineName={alert.discipline.name}
					publishDate={alert.created_at}
					reason={alert.reason}
					student={{
						avatar: alert.student.avatar,
						name: alert.student.name,
						courseName: alert.student.student_class.course.name,
					}}
					teacher={alert.teacher}
				/>
			))}
			{/* <div className="">
				<section className="flex items-center gap-3">
					<div className="w-10 h-10 flex justify-center items-center rounded-full bg-primary-background">
						<User className="text-primary" />
					</div>
					<div className="leading-none">
						<h3 className="text-black text-base font-bold leading-none">
							Felippe Rian{" "}
							<span className="text-xs font-normal ml-1">
								13 de junho, 13:50
							</span>
						</h3>
						<span className="text-gray text-xs">
							Tecnologia em Análise e Desenvolvimento de Sistemas
						</span>
					</div>
				</section>
				<section className="ml-11 mt-3 bg-white p-4 rounded-lg">
					<p className="text-gray text-sm">
						<span className="font-bold">Thiago Henrique</span> na disciplina{" "}
						<span className="font-bold">Processo de software</span>
					</p>
					<br />
					<p className="text-gray text-sm">
						&quot;O professor estava com dor de barriga e mencionou que não
						conseguiria dar aula. Só deu tempo chegar na porta da sala, que ele
						foi pra casa.&quot;
					</p>
				</section>
			</div> */}
		</div>
	);
}
