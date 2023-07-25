"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import ClassCard from "@/components/ClassCard";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/hooks/AuthContext";
import { useGlobal } from "@/hooks/GlobalContext";
import { removeAccents } from "@/utils/removeAccents";
import { CalendarPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Classes() {
	document.title = "Class Planner | Turmas";

	const routes = useRouter();
	const { hasEmployeePermissions } = useAuth();
	const { courses, classes, getAllClasses } = useGlobal();
	const [searchText, setSearchText] = useState("");

	const searchTeacherResults = searchText
		? classes.filter(({ course }) =>
				removeAccents(course.name)
					.toUpperCase()
					.includes(removeAccents(searchText).toUpperCase())
		  )
		: classes;

	useEffect(() => {
		getAllClasses();
	}, []);

	return (
		<div>
			<Breadcrumb title="Turmas">
				<section className="flex flex-row gap-6">
					{hasEmployeePermissions && (
						<Button onClick={() => routes.push("turmas/novo")}>
							<Users className="mr-2" />
							<p>Criar turma</p>
						</Button>
					)}
				</section>
			</Breadcrumb>

			<SearchBar
				onChange={({ target }) =>
					setSearchText(
						target.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
					)
				}
				placeholder="Busque pelo nome do curso"
			/>

			<section className="grid auto-rows-auto grid-cols-cardsGrid gap-5 mt-4">
				{searchTeacherResults.map(({ id, course, reference_period }) => (
					<ClassCard
						key={id}
						href={`turmas/${id}`}
						courseGrade={course.degree}
						courseNickname={course.name}
						period={reference_period}
					/>
				))}
			</section>
		</div>
	);
}
