"use client";

import Breadcrumb from "@/components/Breadcrumb";
import SearchBar from "@/components/SearchBar";
import StudentCard from "@/components/StudentCard";
import { Class } from "@/interfaces/Course";
import { Student } from "@/interfaces/Student";
import { api } from "@/services/api";
import { removeAccents } from "@/utils/removeAccents";
import React, { useEffect, useState } from "react";

interface ClassStudentsProps {
	params: {
		id: number;
	};
}

export default function ClassStudents({
	params,
}: ClassStudentsProps): React.ReactNode {
	const [searchText, setSearchText] = useState("");
	const [students, setStudents] = useState<Student[]>([]);
	const [studentsClass, setStudentsClass] = useState<Class>();

	const searchTeacherResults = searchText
		? students.filter(({ name }) =>
				removeAccents(name)
					.toUpperCase()
					.includes(removeAccents(searchText).toUpperCase())
		  )
		: students;

	const getClassStudents = async () => {
		const { data } = await api.get(`classes/${params.id}/students/`);
		const { data: classData } = await api.get(`classes/${params.id}/`);

		setStudentsClass(classData);
		setStudents(data);
	};

	useEffect(() => {
		getClassStudents();
	}, []);

	return (
		<>
			<Breadcrumb
				title={`Estudantes - ${studentsClass?.course.byname} ${
					studentsClass?.reference_period
				}° ${
					studentsClass?.course.degree === "Ensino superior" ? "período" : "ano"
				} (${studentsClass?.shift})`}
			/>

			<SearchBar
				onChange={({ target }) =>
					setSearchText(
						target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
					)
				}
				placeholder="Busque pelo nome"
			/>

			<section className="grid grid-cols-studentsListContainer gap-6 mt-4">
				{searchTeacherResults.map((student) => (
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
	);
}
