"use client";

import Breadcrumb from "@/components/Breadcrumb";
import StudentCard from "@/components/StudentCard";
import { Student } from "@/interfaces/Student";
import { api } from "@/services/api";
import { useEffect, useState } from "react";

export default function Students() {
	document.title = "Class Planner | Estudantes";

	const [students, setStudents] = useState<Student[]>([]);

	const getAllStudents = async () => {
		const { data } = await api.get("students/");
		
		setStudents(data);
	};

	useEffect(() => {
		getAllStudents();
	}, []);

	return (
		<div>
			<Breadcrumb title="Estudantes" />

			<section className="grid grid-cols-studentsListContainer gap-6">
				{students.map((student) => (
					<StudentCard
						key={student.id}
						name={student.name}
						registration={student.registration}
						studentId={student.id}
						classId={student.student_class.id}
						classPeriod={student.student_class.reference_period}
						courseGrade={student.student_class.course.degree}
						courseNickname={student.student_class.course.byname}
						isClassLeader={
							student.id.toString() === student.student_class.class_leader_id
						}
					/>
				))}
			</section>
		</div>
	);
}
