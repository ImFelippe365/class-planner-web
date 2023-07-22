"use client";

import Breadcrumb from "@/components/Breadcrumb";
import DisciplineCard from "@/components/DisciplineCard";

import { useGlobal } from "@/hooks/GlobalContext";
import Button from "@/components/Button";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { api } from "@/services/api";
import { CourseDiscipline } from "@/interfaces/Discipline";
import DeleteModal from "@/components/DeleteModal";
import { toast } from "react-toastify";
interface CourseDisciplineProps {
	params: {
		courseId: number;
	};
}

export default function CourseDiscipline({
	params,
}: CourseDisciplineProps): React.ReactNode {
	document.title = "Class Planner | Disciplinas";
	const routes = useRouter();
	const [openModal, setOpenModal] = useState<string | undefined>();

	const [disciplines, setDisciplines] = useState<CourseDiscipline[]>([]);

	const getCourseDisciplines = async () => {
		const { data } = await api.get(`/courses/${params.courseId}/disciplines/`);

		setDisciplines(data);
	};

	const deleteDisciplineLink = async (disciplineId: number) => {
		try {
			await api.delete(
				`courses/${params.courseId}/disciplines/${disciplineId}/`
			);

			setOpenModal(undefined);
			getCourseDisciplines();
			toast.success("Disciplina removida com sucesso");
		} catch (err) {
			toast.error("Ocorreu um erro ao tentar remover a disciplina");
		}
	};

	useEffect(() => {
		getCourseDisciplines();
	}, []);

	return (
		<>
			<Breadcrumb title="Disciplinas">
				<section className="flex flex-row gap-6">
					<Button onClick={() => routes.push(`disciplinas/nova`)}>
						<BookOpen className="mr-2" />
						<p>Criar disciplina</p>
					</Button>
				</section>
			</Breadcrumb>

			<section className="grid grid-cols-4 gap-5">
				{disciplines.map(({ id, discipline, course_degree, period }) => (
					<DisciplineCard
						key={id}
						disciplineId={discipline.id}
						courseGrade={course_degree}
						name={discipline.name}
						period={period}
						courseId={params.courseId}
						isOptional={discipline.is_optional}
					>
						<DeleteModal key={id} type="discipline">
							<Button
								key={id}
								color="sucess"
								className="bg-success text-white"
								onClick={() => deleteDisciplineLink(discipline.id)}
							>
								Confirmar
							</Button>
						</DeleteModal>
					</DisciplineCard>
				))}
			</section>
		</>
	);
}
