"use client";

import { Tabs, theme } from "flowbite-react";
import {
	Clock,
	Users,
	BookOpen,
	User,
	AtSign,
	Mail,
	Ban,
	Calendar,
	X,
} from "lucide-react";
import { api } from "@/services/api";
import { Teacher } from "@/interfaces/Teacher";
import ProfileButton from "@/components/ProfileButton";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useSchedule } from "@/hooks/ScheduleContext";
import { Schedule } from "@/interfaces/Course";
import WeekCalendar from "@/components/WeekCalendar";
import {
	DurationInput,
	EventClickArg,
	EventSourceInput,
} from "@fullcalendar/core";
import { shiftsSchedule } from "@/utils/schedules";
import Button from "@/components/Button";
import Image from "next/image";
import { weekdays } from "@/utils/dates";
import { formatTime } from "@/utils/formatTime";
import MonthCalendar from "@/components/MonthCalendar";
import Modal from "@/components/Modal";

interface TeacherProfileProps {
	params: {
		teacherId: string | number;
	};
}

export default function TeacherProfile({ params }: TeacherProfileProps) {
	const [teacher, setTeacher] = useState<Teacher>();
	const [weekSchedules, setWeekSchedules] = useState([]);
	const [monthSchedules, setMonthSchedules] = useState([]);

	const [scheduleToShow, setScheduleToShow] = useState<EventClickArg>();
	const [scheduleToCancel, setScheduleToCancel] = useState<Schedule>();
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [showCancelScheduleModal, setShowCancelScheduleModal] =
		useState<boolean>(false);

	const { getTeacherWeekSchedules, getTeacherMonthSchedules } = useSchedule();
	const weekCalendarRef = useRef<any>(null);

	document.title = `Class Planner | ${teacher?.name}`

	const times = weekSchedules
		.filter(({ display }) => display !== "background")
		.map(({ startTime }: { startTime: string }) => {
			const [hours, minutes, seconds] = startTime?.split(":");

			return Number(hours);
		});

	const initialStartTime = (): DurationInput => {
		const minTime = Math.min(...times);
		const scheduleTimes =
			minTime < 13
				? shiftsSchedule.Manhã
				: minTime > 18
				? shiftsSchedule.Noite
				: shiftsSchedule.Tarde;

		return {
			hour: scheduleTimes.startHour,
			minute: scheduleTimes.startMinute,
		};
	};

	const initialEndTime = (): DurationInput => {
		const maxTime = Math.max(...times);
		const scheduleTimes =
			maxTime < 13
				? shiftsSchedule.Manhã
				: maxTime > 18
				? shiftsSchedule.Noite
				: shiftsSchedule.Tarde;

		return {
			hour: scheduleTimes.endHour,
			minute: scheduleTimes.endMinute,
		};
	};

	const [weekCalendarStartTime, weekCalendarEndTime] = [
		initialStartTime(),
		initialEndTime(),
	];

	const getWeekSchedules = async (date?: Date) => {
		const weekDate = date ? date?.toLocaleString().split(",")[0] : "";
		const teacherWeekSchedules = await getTeacherWeekSchedules(
			`${params.teacherId}`,
			weekDate
		);

		setWeekSchedules(teacherWeekSchedules as any);
	};

	const getMonthSchedules = async (date?: Date) => {
		const month = date ? date?.getMonth() + 1 : undefined;
		const teacherMonthSchedules = await getTeacherMonthSchedules(
			`${params.teacherId}`,
			month
		);

		setMonthSchedules(teacherMonthSchedules as any);
	};

	const getTeacherProfile = async () => {
		const { data } = await api.get(`/teachers/${params.teacherId}/`);

		getMonthSchedules();
		getWeekSchedules();
		setTeacher(data);
	};

	const onSelectedDateChange = (date: Date) => {
		getWeekSchedules(date);
		setSelectedDate(date);

		weekCalendarRef.current.getApi().gotoDate(date);
	};

	useEffect(() => {
		getTeacherProfile();
	}, []);

	const ScheduleDetails = () => {
		const event = scheduleToShow?.event;
		const schedule = event?.extendedProps.schedule as Schedule;

		const scheduleDate = new Date(
			`${schedule.class_date} ${schedule.start_time}`
		);
		const teachers = schedule.discipline.taught_by;
		const top = Number(
			scheduleToShow?.el?.parentElement?.style.top.replace("px", "")
		);

		return (
			<div
				className={`bg-background-color rounded-3xl rounded-tl-none shadow-lg absolute p-8 max-w-[370px] !h-fit w-full z-50`}
				style={{
					inset: scheduleToShow?.el?.parentElement?.style.inset,
					left: (scheduleToShow?.el.offsetWidth || 1) * scheduleDate.getDay(),
					top: top + (scheduleToShow?.el.offsetHeight || 0),
				}}
			>
				<section className="flex items-start justify-between">
					<h4 className="text-black font-bold text-xl">{event?.title}</h4>
					<X
						className="text-black cursor-pointer hover:opacity-60 transition-all"
						onClick={() => setScheduleToShow(undefined)}
					/>
				</section>
				<section className="flex items-center justify-between mt-2 text-sm">
					<div className="flex items-center gap-2">
						<Calendar className="text-placeholder" />
						<span className="text-placeholder ">
							{weekdays[scheduleDate.getDay() - 1]},{" "}
							{scheduleDate.toLocaleDateString("pt-BR", {
								day: "2-digit",
								month: "long",
							})}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Clock className="text-placeholder" />
						<span className="text-placeholder ">
							{formatTime(event?.start as any)} -{" "}
							{formatTime(event?.end as any)}
						</span>
					</div>
				</section>

				<h5 className="text-black font-bold text-lg mt-6 mb-2">
					Professores(as)
				</h5>
				<section>
					{teachers.map((teacher) => (
						<div key={teacher.id} className="flex items-center gap-2">
							{teacher.avatar ? (
								<Image src={teacher.avatar} alt={teacher.name} />
							) : (
								<div className="flex justify-center p-1 rounded-full items-center w-8 bg-primary-background">
									<User className="text-primary" />
								</div>
							)}
							<span className="text-placeholder font-semibold text-sm">
								{teacher.name}
							</span>
						</div>
					))}
				</section>

				<section className="flex items-center justify-end">
					<Button
						onClick={() => setScheduleToCancel(schedule)}
						color="failure"
						className="mt-4"
					>
						<Ban className="text-white mr-2 rounded-lg" />
						<span className="text-white">Cancelar</span>
					</Button>
				</section>
			</div>
		);
	};

	return (
		<>
			<Button onClick={() => setShowCancelScheduleModal(true)}>
				Toggle modal
			</Button>
			<Modal
				title="Cancelar aula"
				description="Preencha as informações abaixo para cancelar a aula selecionada"
				openModal={showCancelScheduleModal}
				setOpenModal={setShowCancelScheduleModal}
				body={<form></form>}
			/>
			<Breadcrumb title="Professores">
				<section></section>
			</Breadcrumb>

			<div className="flex gap-4 items-center">
				<User
					className="rounded-lg bg-primary-background w-16 h-16 p-3"
					color="#007EA7"
				/>

				<div className="text-primary-dark">
					<p className="font-semibold">{teacher?.name}</p>
					<p className="text-sm">Professor(a)</p>
				</div>
			</div>

			<div className="flex justify-between mt-3">
				<div className="flex items-center gap-x-1">
					<AtSign className="w-4 h-4 text-primary-dark" />
					<span>{teacher?.registration}</span>
				</div>

				<div className="flex items-center gap-x-1">
					<Mail className="w-4 h-4 text-primary-dark" />
					<span>{teacher?.email}</span>
				</div>

				<div className="flex items-center gap-x-1">
					<Clock className="w-4 h-4 text-primary-dark" />
					<span> aulas/semana</span>
				</div>
			</div>

			<Tabs.Group
				aria-label="Tabs with icons"
				style="underline"
				className="justify-end mt-3"
			>
				<Tabs.Item
					active
					icon={Clock}
					title="Horários de aula"
					className="outline-none"
				>
					<div className="grid grid-cols-container gap-6">
						<div className="flex flex-col gap-y-4 min-w-fit">
							<MonthCalendar
								onDatePress={(date) => onSelectedDateChange(date)}
								onMonthViewChange={(date) => getMonthSchedules(date)}
								events={monthSchedules}
							/>

							<ProfileButton
								type="export"
								title="Exportar horários"
								text="Mesmos horários em exibição"
							/>
							<ProfileButton
								type="export"
								title="Exportar relatório"
								text="Relatório mensal com carga horária"
							/>
						</div>

						<section className="w-full relative">
							{scheduleToShow && <ScheduleDetails />}
							<WeekCalendar
								getCalendarRef={(ref) => (weekCalendarRef.current = ref)}
								slotDuration={{
									minute: 10,
								}}
								initialDate={selectedDate}
								slotMinTime={weekCalendarStartTime}
								slotMaxTime={weekCalendarEndTime}
								height={"auto"}
								events={weekSchedules}
								eventClick={(event) =>
									event.event.display !== "background" &&
									setScheduleToShow(event)
								}
								editable={false}
								clickable
							/>
						</section>
					</div>
				</Tabs.Item>

				<Tabs.Item icon={Users} title="Turmas" className="outline-none">
					<div className="flex flex-row flex-wrap justify-center gap-4"></div>
				</Tabs.Item>

				<Tabs.Item icon={BookOpen} title="Disciplinas" className="outline-none">
					<div className="flex flex-row gap-6">
						<div className="flex flex-col gap-y-4 min-w-fit">
							<ProfileButton
								type="bind"
								title="Vincular disciplina"
								text="Adicionar disciplina ao professor"
							/>
						</div>

						<div className="flex flex-row flex-wrap gap-4"></div>
					</div>
				</Tabs.Item>
			</Tabs.Group>
		</>
	);
}
