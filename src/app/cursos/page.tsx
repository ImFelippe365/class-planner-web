"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import CourseCard from "@/components/CourseCard";
import { Course } from "@/interfaces/Course";
import { GraduationCap, Plus, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Courses(): React.ReactNode {
	const [courses, setCourses] = useState<Course[]>([]);

	const getAllCourses = async () => {};

	useEffect(() => {
		getAllCourses();
	}, []);

	return (
		<div className="w-full">
			<Breadcrumb title="Cursos">
				<section className="flex flex-row gap-6">
					<Button>
						<>
							<GraduationCap className="mr-2" />
							<p>Criar curso</p>
						</>
					</Button>

					<Button>
						<>
							<Users className="mr-2" />
							<p>Criar turma</p>
						</>
					</Button>
				</section>
			</Breadcrumb>

			<section className="grid auto-rows-auto grid-cols-cardsGrid  gap-5">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((course) => (
					<CourseCard key={course} courseGrade="teste" courseName="teste2" />
				))}
			</section>
		</div>
	);
}
