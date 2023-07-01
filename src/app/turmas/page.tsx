"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import ClassCard from "@/components/ClassCard";
import { useGlobal } from "@/hooks/GlobalContext";
import { CalendarPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Classes() {

	const routes = useRouter();
	const { courses, classes, getAllClasses } = useGlobal();


	useEffect(() => {
		getAllClasses();
	}, []);

	return (
		<div>
			<Breadcrumb title="Turmas">
				<section className="flex flex-row gap-6">
					<Button onClick={() => routes.push(`turmas/${1}`)}>
						<CalendarPlus className="mr-2" />
						<p>Criar horário</p>
					</Button>
					<Button onClick={() => routes.push("turmas/novo")}>
						<Users className="mr-2" />
						<p>Criar turma</p>
					</Button>
				</section>
			</Breadcrumb>

			<section className="grid auto-rows-auto grid-cols-cardsGrid gap-5">
				{classes.map(({ id, reference_period }) => (
					<ClassCard
						key={id}
						courseGrade="d"
						courseNickname="23"
						period={reference_period}
					/>
				))}
			</section>
		</div>
	);
}
