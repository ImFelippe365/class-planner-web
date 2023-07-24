"use client";

import Breadcrumb from "@/components/Breadcrumb";
import React, { useEffect, useState } from "react";
import { useGlobal } from "@/hooks/GlobalContext";
import TeacherCard from "@/components/TeacherCard";
import SearchBar from "@/components/SearchBar";
import { removeAccents } from "@/utils/removeAccents";

export default function Teachers(): React.ReactNode {
	document.title = "Class Planner | Professores";

	const [searchText, setSearchText] = useState("");
	const { teachers, getAllTeachers } = useGlobal();

	const searchTeacherResults = searchText
		? teachers.filter(({ name }) =>
				removeAccents(name)
					.toUpperCase()
					.includes(removeAccents(searchText).toUpperCase())
		  )
		: teachers;

	useEffect(() => {
		getAllTeachers();
	}, []);

	return (
		<main>
			<Breadcrumb title="Professores" />

			<SearchBar
				onChange={({ target }) =>
					setSearchText(
						target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
					)
				}
				placeholder="Busque pelo nome"
			/>

			<section className="grid grid-cols-2 gap-4 mt-4">
				{searchTeacherResults.map(({ id, registration, name, avatar }) => (
					<TeacherCard
						key={id}
						teacherId={id}
						registration={registration}
						name={name}
						teacherAvatar={avatar}
					/>
				))}
			</section>
		</main>
	);
}
