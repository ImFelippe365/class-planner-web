"use client"

import Breadcrumb from "@/components/Breadcrumb";
import DisciplineCard from "@/components/DisciplineCard";

import { useGlobal } from "@/hooks/GlobalContext";
import Button from "@/components/Button";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "@/services/api";
import { CourseDiscipline, Discipline } from "@/interfaces/Discipline";
import { Course } from "@/interfaces/Course";

interface CourseDisciplineProps {
	params: {
		courseId: number;
	};
}

export default function CourseDiscipline({ params }: CourseDisciplineProps)
	: React.ReactNode {
	const routes = useRouter();

	const [disciplines, setDisciplines] = useState<CourseDiscipline[]>([])
	const [course, setCourse] = useState<Course>()

	const getCourseDisciplines = async () => {
		const { data } = await api.get(`/courses/${params.courseId}/disciplines/`)

		setDisciplines(data)
	}

	const getCourse = async () => {
		const { data } = await api.get(`/courses/${params.courseId}/`)

		setCourse(data)
	}

	useEffect(() => {
		getCourse();
		getCourseDisciplines();
	}, [])

	return (
		<>
			<Breadcrumb title="Disciplinas">
				<section className="flex flex-row gap-6">
					<Button onClick={() => routes.push(`cursos/${params.courseId}/disciplinas/nova`)}>
						<BookOpen className="mr-2" />
						<p>Criar disciplina</p>
					</Button>
				</section>
			</Breadcrumb>

			<section className="grid grid-cols-4 gap-5">
				{disciplines.map(({ id, discipline_id, period }) => (
					<DisciplineCard
						key={id}
						disciplineId={id}
						courseGrade={course?.degree}
						name={discipline_id.name}
						period={period} />
				))}
			</section>
		</>
	)
}