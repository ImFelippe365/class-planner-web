"use client"

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import ClassCard from "@/components/ClassCard";
import { Class } from "@/interfaces/Course";
import { api } from "@/services/api";
import React, { useEffect, useState } from "react";

interface CourseClassesProps {
	params: {
		courseId: number;
	};
}

export default function CourseClasses({ params }: CourseClassesProps): React.ReactNode {
	const [courseClasses, setCourseClasses] = useState<Class[]>([]);

	const getCourseClasses = async () => {
		const { data } = await api.get(`courses/${params.courseId}/classes/`)

		setCourseClasses(data)
	}

	useEffect(() => {
		getCourseClasses();
	}, [])

	return (
		<>
			<Breadcrumb title="Turmas">
				<section className="flex flex-row gap-6">
					<Button >
						<p>Criar disciplina</p>
					</Button>
				</section>
			</Breadcrumb>

			<section className="grid grid-cols-4 gap-5">
				{courseClasses.map(({ id, reference_period, course }) => (
					<ClassCard
						key={id}
						href={`turmas/${id}`}
						courseGrade={course.degree}
						courseNickname={course.byname}
						period={reference_period}
					/>
				))}
			</section>
		</>
	)
}