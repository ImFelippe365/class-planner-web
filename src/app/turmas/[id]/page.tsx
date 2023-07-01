"use client";

import Breadcrumb from "@/components/Breadcrumb";
import WeekCalendar from "@/components/WeekCalendar";
import { EventSourceInput } from "@fullcalendar/core";
import {
	BookMarked,
	CalendarPlus,
	Check,
	Clock,
	Crown,
	Pencil,
	X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { eventColors } from "@/utils/eventColors";
import { Select } from "flowbite-react";
import DisciplineItem from "@/components/DisciplineItem";
import Button from "@/components/Button";
import { Draggable } from "@fullcalendar/interaction";
import { api } from "@/services/api";
import { Discipline } from "@/interfaces/Course";

interface ClassProps {
	params: {
		id: string;
	};
}

export default function Class({ params }: ClassProps) {
	const { id } = params;
	const [weekSchedules, setWeekSchedules] = useState<EventSourceInput>([
		{
			id: "1",
			title: "Evento 1",
			start: new Date("2023-06-29 13:00"),
			end: new Date("2023-06-29 14:20"),
			...eventColors.normal,
		},
	]);
	const [monthSchedules, setMonthSchedules] = useState([]);
	const [editableMode, setEditableMode] = useState(false);
	const [disciplines, setDisciplines] = useState<Discipline[]>([]);

	const onAddSchedule = () => {};

	const getWeekSchedules = async () => {
		const { data } = await api.get(`/classes/${id}/schedules/week/`);
		const temporaryData = [
			{
				id: "1",
				quantity: 4,
				weekday: 4,
				start_time: "13:00",
				end_time: "14:20",
				class_id: 1,
				schedule_class: "string",
				discipline_id: 0,
				discipline: "Desenvolvimento de Sistemas",
				canceled_class: false,
				class_to_replace: false,
				class_date: "",
			},
		];
		setWeekSchedules(data);
	};

	const getMonthSchedules = async () => {
		const { data } = await api.get(`/classes/${id}/schedules/week/`);

		setWeekSchedules(data);
	};

	const getClassDisciplines = async () => {
		const { data } = await api.get(`/classes/${id}/disciplines/`);
		console.log(data);
		setDisciplines(data);
	};

	const weekSchedulesRef = useRef<any>(null);

	const onSubmitSchedules = () => {
		

		setEditableMode(false);
	};

	const initDraggableElement = () => {
		let draggableEl = document.getElementById("external-events") as HTMLElement;

		new Draggable(draggableEl, {
			itemSelector: ".fc-event",
			eventData: function (eventEl) {
				let title = eventEl.getAttribute("title");
				let id = eventEl.getAttribute("data");

				return {
					id: id,
					title: title,
					duration: "00:45:00",
					...eventColors.new,
					dadoTeste: "este dado foi adicionado manualmente",
				};
			},
		});
	};

	useEffect(() => {
		getWeekSchedules();
		getMonthSchedules();
		getClassDisciplines();
		initDraggableElement();
	}, []);

	return (
		<div>
			<Breadcrumb title="Turma" />

			<div className="grid grid-cols-classContainer gap-8">
				<section>
					<div className="flex items-center justify-between">
						<h3 className="font-bold text-black text-xl">Horário das aulas</h3>

						{editableMode ? (
							<div className="flex items-center gap-3">
								<Button
									onClick={() => setEditableMode(false)}
									size="xs"
									className="transparent"
									color="failure"
								>
									<X size={16} className="text-white mr-2" />
									<span>Cancelar</span>
								</Button>
								<Button
									onClick={() => onSubmitSchedules()}
									size="xs"
									color={"success"}
								>
									<Check size={16} className="text-white mr-2" />
									<span>Salvar</span>
								</Button>
							</div>
						) : (
							<div>
								{weekSchedules ? (
									<Button
										onClick={() => setEditableMode(true)}
										size="xs"
										className="transparent"
										color="warning"
									>
										<Pencil size={16} className="text-white mr-2" />
										<span>Editar</span>
									</Button>
								) : (
									<Button
										onClick={() => setEditableMode(true)}
										size="xs"
										className="transparent"
									>
										<CalendarPlus size={16} className="text-white mr-2" />
										<span>Adicionar</span>
									</Button>
								)}
							</div>
						)}
					</div>

					<p className="text-gray mb-4">Aulas semanais desta turma</p>
					<WeekCalendar
						weekCalendarRef={(ref) => (weekSchedulesRef.current = ref)}
						editable={editableMode}
						eventClick={() => console.log("teste")}
						events={weekSchedules}
						eventReceive={() => console.log("evento foi adicionado")}
						eventDrop={() => console.log("evento foi dropado")} // acontece quando movo um evento
						eventResize={({ event, revert }) => {
							console.log(event);
							console.log("evento foi redimesionado", event.end);
							revert();
						}} // acontece quando diminuo o tempo de um evento
					/>
				</section>
				<section>
					<section>
						<h4 className="font-bold text-black text-xl">
							Análise e Desenvolvimento de Sistemas
						</h4>

						<section className="flex justify-between items-center mt-3">
							<div className="flex items-center gap-x-3">
								<Clock size={30} className="text-gray" />

								<div className="flex flex-col">
									<span className="block font-bold text-base text-black leading-tight">
										2.700
									</span>
									<span className="text-gray text-xs font-normal">
										Carga horária
									</span>
								</div>
							</div>

							<div className="flex items-center gap-x-3">
								<Crown size={30} className="text-gray" />

								<div className="flex flex-col">
									<span className="block font-bold text-base text-black leading-tight">
										Felippe Rian{" "}
										<span className="font-normal text-gray text-xs">
											(20211094040028)
										</span>
									</span>
									<span className="text-gray text-xs font-normal">
										Representante
									</span>
								</div>
							</div>
						</section>
						<Select
							className="text-xs text-black mt-3"
							defaultValue="5º período"
							id="teste"
							required
						>
							<option>1º período</option>
							<option>2º período</option>
							<option>3º período</option>
							<option>4º período</option>
							<option>5º período</option>
						</Select>
					</section>

					<section>
						<h4 className="font-bold text-black text-lg mt-6 mb-3">
							Disciplinas
						</h4>

						<div id="external-events" className="flex flex-col gap-5">
							{disciplines.map((discipline) => (
								<DisciplineItem
									key={discipline.id}
									teacherName={"Irlan Arley"}
									disciplineName={discipline.name}
									availableQuantity={discipline.workload_in_clock / 20}
									editable={editableMode}
									data-title={'teste'}
								/>
							))}
						</div>
					</section>
				</section>
			</div>
		</div>
	);
}
