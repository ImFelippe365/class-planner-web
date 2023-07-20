"use client"

import Breadcrumb from "@/components/Breadcrumb";
import StudentCard from "@/components/StudentCard";
import { Student } from "@/interfaces/Student";
import { api } from "@/services/api";
import React, { useEffect, useState } from "react";

interface ClassStudentsProps {
	params: {
		id: number;
	};
}

export default function ClassStudents({ params }: ClassStudentsProps): React.ReactNode {
	const [students, setStudents] = useState<Student[]>([]);

	const getClassStudents = async () => {
		const { data } = await api.get(`classes/${params.id}/students/`)

		setStudents(data);
	}

	useEffect(() => {
		getClassStudents();
	}, [])

	return (
		<>
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
		</>
	)
}