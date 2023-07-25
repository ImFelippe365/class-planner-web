"use client";

import Breadcrumb from "@/components/Breadcrumb";
import SearchBar from "@/components/SearchBar";
import StudentCard from "@/components/StudentCard";
import { Student } from "@/interfaces/Student";
import { api } from "@/services/api";
import { removeAccents } from "@/utils/removeAccents";
import { useEffect, useState } from "react";

export default function Students() {
	document.title = "Class Planner | Estudantes";

	const [searchText, setSearchText] = useState("");
	const [students, setStudents] = useState<Student[]>([]);

	const searchTeacherResults = searchText
		? students.filter(({ name }) =>
				removeAccents(name)
					.toUpperCase()
					.includes(removeAccents(searchText).toUpperCase())
		  )
		: students;

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
						studentAvatar={student.avatar}
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
