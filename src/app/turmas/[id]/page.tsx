"use client";

import Breadcrumb from "@/components/Breadcrumb";
import WeekCalendar from "@/components/WeekCalendar";
import {
	BookMarked,
	CalendarPlus,
	Check,
	Clock,
	Crown,
	Pencil,
	X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { eventColors } from "@/utils/eventColors";
import { FlowbiteSelectTheme, Select, SelectSizes } from "flowbite-react";
import DisciplineItem from "@/components/DisciplineItem";
import Button from "@/components/Button";
import { Draggable, EventReceiveArg } from "@fullcalendar/interaction";
import { api } from "@/services/api";
import { Class, Discipline } from "@/interfaces/Course";
import { formatDisciplineName } from "@/utils/formatDisciplineName";
import { formatTime } from "@/utils/formatTime";
import { EventChangeArg } from "@fullcalendar/core";
import { reference_periods, shiftsSchedule } from "@/utils/schedules";
import { useSchedule } from "@/hooks/ScheduleContext";
import { useGlobal } from "@/hooks/GlobalContext";
import { useRouter } from "next/navigation";

interface ClassProps {
	params: {
		id: string;
	};
}

interface DisciplineSchedule {
	discipline_id: number;
	quantity: number;
	weekday: number;
	start_time: string;
	end_time: string;
}

export default function Class({ params }: ClassProps) {
	const { id } = params;
	const router = useRouter();
	const {
		getMonthSchedules,
		getWeekSchedules,
		weekSchedules,
		monthSchedules,
		editableMode,
		setEditableMode,
		newWeekSchedules,
		setNewWeekSchedules,
	} = useSchedule();
	const { classes } = useGlobal();

	const [classDetails, setClassDetails] = useState<Class>();
	const [disciplines, setDisciplines] = useState<Discipline[]>([]);

	const getClassDisciplines = async () => {
		const { data } = await api.get(`/classes/${id}/disciplines/`);

		setDisciplines(data);
	};

	const getClassDetails = async () => {
		const { data } = await api.get(`/classes/${id}/`);

		setClassDetails(data);
	};

	const onSubmitSchedules = () => {
		setEditableMode(false);
	};

	const onReceiveSchedule = (args: EventReceiveArg) => {
		const start = args?.event?.start as any;
		const end = args?.event?.end as any;
		const quantity = (end - start) / 60000 / 45;
		const weekday = (args.event.start?.getDay() as any) - 1;

		const newEvent: DisciplineSchedule = {
			discipline_id: Number(args.event.id),
			weekday,
			start_time: formatTime(start),
			end_time: formatTime(end),
			quantity,
		};

		const newSchedules = [...newWeekSchedules];
		newSchedules.push(newEvent);
		// console.log("Evento externo dropado 👍", newSchedules);

		setNewWeekSchedules(newSchedules);
	};

	const onChangeSchedule = ({ event, oldEvent, revert }: EventChangeArg) => {
		const start = event?.start as any;
		const end = event?.end as any;
		const quantity = (end - start) / 60000 / 45;

		// Fazer verificação da hora que o horário INICIAL foi inserido, > 7, > 12, > 19
		if (
			start.getHours() <
			shiftsSchedule[classDetails?.shift || "Manhã"].startHour
		) {
			revert();
		}

		// Fazer verificação da hora que o horário FINAL foi inserido, 12 >, 18 >, 22: 10 >
		if (
			end.getHours() * 60 ===
				shiftsSchedule[classDetails?.shift || "Manhã"].endHour * 60 &&
			end.getMinutes() >
				shiftsSchedule[classDetails?.shift || "Manhã"].endMinute
		) {
			revert();
		}

		// Verificar se o horário inserido não excede a quantidade de disciplinas a ser ofertada na semana

		// Verificação básica se o horário de aula é válido (1 aula = 45 minutos)
		if (((end - start) / 60000) % 45 !== 0) {
			revert();
		}

		const weekday = (event.start?.getDay() as any) - 1;
		const oldWeekday = (oldEvent.start?.getDay() as any) - 1;

		const newEvent: DisciplineSchedule = {
			discipline_id: Number(event.id),
			weekday,
			start_time: formatTime(start),
			end_time: formatTime(end),
			quantity,
		};

		const newSchedules = [...newWeekSchedules];

		const alreadyInSchedules = newWeekSchedules.findIndex(
			({ discipline_id, weekday }) =>
				oldWeekday === weekday && discipline_id === newEvent.discipline_id
		);

		if (alreadyInSchedules >= 0) {
			newSchedules.splice(alreadyInSchedules, 1);
		}

		newSchedules.push(newEvent);
		setNewWeekSchedules(newSchedules);
	};

	const handleChangeClassPeriod = (period: string) => {
		const foundClass = classes.find(
			({ reference_period, course_id }) =>
				classDetails?.course_id === course_id &&
				period === reference_period.toString()
		);

		if (foundClass) router.push(`turmas/${foundClass?.id}`);
	};

	const initDraggableElement = () => {
		let draggableEl = document.getElementById("external-events") as HTMLElement;

		new Draggable(draggableEl, {
			itemSelector: ".fc-event",
			eventData: function (eventEl) {
				let title = eventEl.getAttribute("title");
				let id = eventEl.getAttribute("id");

				return {
					id: id,
					title: formatDisciplineName(`${title}`),
					duration: "00:45:00",
					...eventColors.new,
					dadoTeste: "este dado foi adicionado manualmente",
				};
			},
		});
	};

	useEffect(() => {
		getWeekSchedules(id);
		getMonthSchedules(id);
		getClassDetails();
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
						slotMinTime={{
							hour: shiftsSchedule[classDetails?.shift || "Tarde"].startHour,
						}}
						slotMaxTime={{
							hour: shiftsSchedule[classDetails?.shift || "Tarde"].endHour,
							minute: shiftsSchedule[classDetails?.shift || "Tarde"].endMinute,
						}}
						editable={editableMode}
						events={weekSchedules}
						eventChange={onChangeSchedule}
						eventReceive={onReceiveSchedule}
					/>
				</section>
				<section>
					<section>
						<h4 className="font-bold text-black text-2xl">
							{classDetails?.course.name}{" "}
							<span className="font-normal text-gray text-base">
								({classDetails?.shift})
							</span>
						</h4>

						<section className="flex gap-8 items-center mt-3">
							<div className="flex items-center gap-x-3">
								<Clock size={30} className="text-gray" />

								<div className="flex flex-col">
									<span className="block font-bold text-base text-black leading-tight">
										{classDetails?.course.course_load}
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
										{classDetails?.class_leader_id || "Nenhum definido"}{" "}
										{/* <span className="font-normal text-gray text-xs">
											(20211094040028)
										</span> */}
									</span>
									<span className="text-gray text-xs font-normal">
										Representante
									</span>
								</div>
							</div>
						</section>
						{/* <div className="flex items-center">
							<button
								id="dropdownProject"
								data-dropdown-toggle="dropdown-project"
								className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:focus:ring-gray-700"
							>
								<svg
									className="mr-1.5 w-3 h-3"
									aria-hidden="true"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 448 512"
								>
									<path d="M80 104c13.3 0 24-10.7 24-24s-10.7-24-24-24S56 66.7 56 80s10.7 24 24 24zm80-24c0 32.8-19.7 61-48 73.3v87.8c18.8-10.9 40.7-17.1 64-17.1h96c35.3 0 64-28.7 64-64v-6.7C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V160c0 70.7-57.3 128-128 128H176c-35.3 0-64 28.7-64 64v6.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V352 153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm232 0c0-13.3-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24zM80 456c13.3 0 24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24z" />
								</svg>
								flowbite.com
								<svg
									className="w-5 h-5 ml-1"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clip-rule="evenodd"
									></path>
								</svg>
							</button>
						</div> */}
						<Select
							onChange={(event) => handleChangeClassPeriod(event.target.value)}
							className="text-xs text-black mt-3 "
						>
							{reference_periods.map(({ label, value }, index) => (
								<option
									selected={value === classDetails?.reference_period.toString()}
									key={index}
									value={value}
								>
									{label}
								</option>
							))}
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
									teacherName={discipline.taught_by
										.map(({ name }) => name)
										.join(", ")}
									disciplineName={discipline.name}
									availableQuantity={discipline.workload_in_clock}
									editable={editableMode}
									id={discipline.id.toString()}
									title={discipline.name}
								/>
							))}
						</div>
					</section>
				</section>
			</div>
		</div>
	);
}
