"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import {
	TeacherDiscipline,
	TeacherRequest,
	TeacherRequestStatus,
} from "@/interfaces/Teacher";
import { api } from "@/services/api";
import { formatDisciplineName } from "@/utils/formatDisciplineName";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SelectOptions } from "@/interfaces/Utils";

interface SubstituteScheduleForm {
	discipline_id: string;
}

export default function RequestsForReplacement() {
	const schema = yup.object({
		discipline_id: yup
			.string()
			.required("Selecione uma disciplina que deseja ministrar no lugar"),
	});

	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { isSubmitting },
	} = useForm<SubstituteScheduleForm>({
		resolver: yupResolver<SubstituteScheduleForm>(schema),
	});

	const [teachersRequests, setTeachersRequests] = useState<TeacherRequest[]>(
		[]
	);
	const [showSubstituteScheduleModal, setShowSubstituteScheduleModal] =
		useState(false);
	const [teacherDisciplinesOptions, setTeacherDisciplinesOptions] = useState<
		SelectOptions[]
	>([]);
	const [substituteScheduleData, setSubstituteScheduleData] =
		useState<TeacherRequest>();

	const getTeachersRequests = async () => {
		const { data } = await api.get(`teachers/2/replace-classes/`);

		setTeachersRequests(data);
	};

	const getTeacherDisciplines = async (schedule: TeacherRequest) => {
		const { data } = await api.get(`teachers/2/disciplines/`);

		const options = data
			?.filter(
				({ teach_class }: TeacherDiscipline) =>
					teach_class.id === schedule.schedule_class.id
			)
			.map(({ discipline }: TeacherDiscipline) => {
				return { label: discipline.name, value: discipline.id };
			});

		setSubstituteScheduleData(schedule);
		setTeacherDisciplinesOptions(options);
		setShowSubstituteScheduleModal(true);
	};

	const changeTeacherRequestStatus = async (
		status: TeacherRequestStatus,
		id: any = substituteScheduleData?.id
	) => {
		const response = await api.patch(`schedules/canceled/${id}/`, {
			replace_class_status: status,
		});

		getTeachersRequests();
	};

	const onSubmit = async (data: SubstituteScheduleForm) => {
		const response = await api.post("temporary-classes/", {
			...data,
			teacher_id: substituteScheduleData?.teacher_to_replace,
			class_id: substituteScheduleData?.schedule.class_id,
			class_canceled_id: substituteScheduleData?.id,
		});

		setShowSubstituteScheduleModal(false);
		changeTeacherRequestStatus("Aceito");
	};

	useEffect(() => {
		getTeachersRequests();
	}, []);

	return (
		<div>
			<Breadcrumb title="Pedidos para substituir aula" />
			<Modal
				title="Substituir aula"
				openModal={showSubstituteScheduleModal}
				setOpenModal={setShowSubstituteScheduleModal}
				body={
					<form onSubmit={handleSubmit(onSubmit)}>
						<Select
							control={control}
							name="discipline_id"
							options={teacherDisciplinesOptions}
						/>
						<Button type="submit">Confirmar</Button>
					</form>
				}
			/>

			<section className="grid grid-cols-2 gap-6">
				{teachersRequests.map((request) => (
					<div key={request.id} className="bg-white p-6 rounded-xl">
						<div className="flex flex-row items-center justify-between mb-2">
							<h3 className="text-black text-lg">
								<span
									className={`${
										request.replace_class_status === "Aceito"
											? "bg-success"
											: request.replace_class_status === "Recusado"
											? "bg-error"
											: "bg-warning"
									} py-1 px-4 text-sm rounded-2xl text-white`}
								>
									{request.replace_class_status}
								</span>
								<span className="font-bold ml-3">
									{request.schedule.requested_by.name}
								</span>{" "}
								quer trocar de aula com você
							</h3>

							{request.replace_class_status === "Pendente" && (
								<div className="flex items-center gap-2">
									<Button
										onClick={() => getTeacherDisciplines(request)}
										size="xs"
										color={"success"}
									>
										Aceitar
									</Button>
									<Button
										onClick={() =>
											changeTeacherRequestStatus("Recusado", request.id)
										}
										size="xs"
										color={"failure"}
									>
										Recusar
									</Button>
								</div>
							)}
						</div>

						<div className="text-gray">
							<span className="font-bold">Disciplina:</span>{" "}
							{formatDisciplineName(request.schedule.discipline.name)}
						</div>
						<div className="text-gray">
							<span className="font-bold">Turma:</span>{" "}
							{request.schedule_class.course.byname}{" "}
							{request.schedule_class.reference_period}º{" "}
							{request.schedule_class.course.degree === "Ensino superior"
								? "período"
								: "ano"}{" "}
							- {request.schedule_class.shift}
						</div>
						<div className="text-gray">
							<span className="font-bold">Horário:</span>{" "}
							{new Date(
								`${request.canceled_date} ${request.schedule.start_time}`
							).toLocaleString("pt-BR", {
								day: "2-digit",
								month: "long",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}{" "}
							até{" "}
							{new Date(
								`${request.canceled_date} ${request.schedule.end_time}`
							).toLocaleString("pt-BR", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</div>
					</div>
				))}
			</section>
		</div>
	);
}
