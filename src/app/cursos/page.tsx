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
import DeleteModal from "@/components/DeleteModal";
import { toast } from "react-toastify";
export default function Courses(): React.ReactNode {
	document.title = "Class Planner | Cursos";

	const routes = useRouter();
	const { courses, getAllCourses } = useGlobal();
	const [openModal, setOpenModal] = useState<string | undefined>();

	const deleteCourse = async (courseId: number) => {
		try {
			await api.delete(`courses/${courseId}/`);
			setOpenModal(undefined);
			getAllCourses();

			toast.success("Curso removido com sucesso");
		} catch (err) {
			toast.error("Ocorreu um problema ao tentar remover o curso");
		}
	};

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
					<CourseCard
						key={id}
						courseId={id}
						courseGrade={degree}
						courseName={name}
					>
						<DeleteModal key={id} type="course">
							<Button
								key={id}
								color="sucess"
								className="bg-success text-white"
								onClick={() => deleteCourse(id)}
							>
								Confirmar
							</Button>
						</DeleteModal>
					</CourseCard>
				))}
			</section>
		</div>
	);
}
