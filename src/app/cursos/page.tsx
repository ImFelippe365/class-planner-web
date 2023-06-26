"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import CourseCard from "@/components/CourseCard";
import { useGlobal } from "@/hooks/GlobalContext";
import { Course } from "@/interfaces/Course";
import { api } from "@/services/api";
import { GraduationCap, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Courses(): React.ReactNode {
	const routes = useRouter();
	const { courses, getAllCourses } = useGlobal();

	useEffect(() => {
		getAllCourses();
	}, []);

	return (
		<div className="w-full">
			<Breadcrumb title="Cursos">
				<section className="flex flex-row gap-6">
					<Button onClick={() => routes.push("cursos/novo")}>
						<GraduationCap className="mr-2" />
						<p>Criar curso</p>
					</Button>
				</section>
			</Breadcrumb>

			<section className="grid auto-rows-auto grid-cols-cardsGrid gap-5">
				{courses.map(({ id, name, degree }) => (
					<CourseCard key={id} courseGrade={degree} courseName={name} />
				))}
			</section>
		</div>
	);
}
