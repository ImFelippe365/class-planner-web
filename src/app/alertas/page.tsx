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
						courseName: `${alert.student.student_class.course.byname} ${
							alert.student.student_class.reference_period
						}º ${
							alert.student.student_class.course.degree === "Ensino superior"
								? "período"
								: "ano"
						}`,
					}}
					teacher={alert.teacher}
				/>
			))}
		</div>
	);
}
