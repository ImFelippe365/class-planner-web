"use client";

import Breadcrumb from "@/components/Breadcrumb";
import React, { useEffect, useState } from "react";
import { useGlobal } from "@/hooks/GlobalContext";
import TeacherCard from "@/components/TeacherCard";
import SearchBar from "@/components/SearchBar";

export default function Teachers(): React.ReactNode {
	const { teachers, getAllTeachers } = useGlobal();

	useEffect(() => {
		getAllTeachers();
	}, [])

	return (
		<main>
			<Breadcrumb title="Professores" />
			
			<SearchBar placeholder='Busque pelo nome' />

			<section className="grid grid-cols-2 gap-4 mt-4">
				{teachers.map(({ id, registration, name }) => (
					<TeacherCard teacherId={id} registration={registration} name={name} />
				))}
			</section>
		</main>
	);
}
