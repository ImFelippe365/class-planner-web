"use client";

import { Tabs, theme } from "flowbite-react";
import {
	Clock,
	Users,
	BookOpen,
	User,
	Ban,
	Calendar,
	X,
	Plus,
	Download,
	Play,
	ClipboardSignature,
} from "lucide-react";
import { api } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import { useSchedule } from "@/hooks/ScheduleContext";
import {
	DurationInput,
	EventClickArg,
	EventSourceInput,
} from "@fullcalendar/core";
import Image from "next/image";

import { allScheduleStartTimes, shiftsSchedule } from "@/utils/schedules";
import { weekdays } from "@/utils/dates";
import { formatTime } from "@/utils/formatTime";

import Breadcrumb from "@/components/Breadcrumb";
import WeekCalendar from "@/components/WeekCalendar";
import Button from "@/components/Button";
import MonthCalendar from "@/components/MonthCalendar";
import Modal from "@/components/Modal";
import DisciplineCard from "@/components/DisciplineCard";
import DeleteModal from "@/components/DeleteModal";
import CreateDisciplineBindFormModal from "./components/CreateDisciplineBindFormModal";
import CancelScheduleFormModal from "./components/CancelScheduleFormModal";

import {
	Teacher,
	TeacherClasses,
	TeacherDiscipline,
} from "@/interfaces/Teacher";
import { ClassCanceled, Schedule } from "@/interfaces/Course";
import TeacherInformations from "./components/TeacherInformations";
import ClassCard from "@/components/ClassCard";
import TeachCanceledClassFormModal from "./components/TeachCanceledClassFormModal";
import { formatDisciplineName } from "@/utils/formatDisciplineName";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from "react-toastify";

import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import ExportTeacherWeekSchedulesPDF from "./components/ExportTeacherWeekSchedules";
import ExportTeacherReport from "./components/ExportTeacherReport";

interface TeacherProfileProps {
	params: {
		teacherId: string | number;
	};
}

export default function TeacherProfile({ params }: TeacherProfileProps) {
	const [teacherDisciplines, setTeacherDisciplines] = useState<
		TeacherDiscipline[]
	>([]);
	const [amountOfLessons, setAmountOfLessons] = useState(0);
	const [teacherClasses, setTeacherClasses] = useState<TeacherClasses[]>([]);

	const [teacher, setTeacher] = useState<Teacher>();
	const [weekSchedules, setWeekSchedules] = useState([]);
	const [monthSchedules, setMonthSchedules] = useState([]);

	const [scheduleToShow, setScheduleToShow] = useState<EventClickArg>();
	const [scheduleToCancel, setScheduleToCancel] = useState<Schedule>();
	const [scheduleToResume, setScheduleToResume] = useState<number>();
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const [showCancelScheduleModal, setShowCancelScheduleModal] =
		useState<boolean>(false);
	const [showResumeClassModal, setShowResumeClassModal] =
		useState<boolean>(false);

	const [classCanceled, setClassCanceled] = useState<ClassCanceled>();

	const { user, hasTeacherPermissions, hasEmployeePermissions } = useAuth();
	const { getTeacherWeekSchedules, getTeacherMonthSchedules } = useSchedule();
	const weekCalendarRef = useRef<any>(null);

	const [showCreateBindModal, setShowCreateBindModal] =
		useState<boolean>(false);

	const [showTeachCanceledClass, setShowTeachCanceledClass] =
		useState<boolean>(false);

	const [weekSchedulesTeacher, setWeekSchedulesTeacher] = useState<Schedule[]>(
		[]
	);

	const [scheduleByTime, setScheduleByTime] = useState<Object>();

	const [monthSchedulesTeacher, setMonthSchedulesTeacher] = useState<Schedule[]>([])

	document.title = `Class Planner | ${teacher?.name}`;

	const times = weekSchedules
		.filter(({ display }) => display !== "background")
		.map(({ startTime }: { startTime: string }) => {
			const [hours, minutes, seconds] = startTime?.split(":");

			return Number(hours);
		});

	const getAmountOfLessons = async () => {
		const { data } = await api.get(
			`teachers/${params.teacherId}/schedules/week/`
		);

		let quantity = 0;
		data.map((item: any) => {
			quantity += item.quantity;
		});

		setAmountOfLessons(quantity);

		// Separar aulas juntas 2 -> 1, 4 -> 4x 1
		const teacherSchedules = data.reduce(
			(accumulator: Schedule[], schedule: Schedule) => {
				if (schedule.quantity > 1) {
					const [start, end] = allScheduleStartTimes
						.find(
							(time) =>
								time.split("-")[0].trim() === schedule.start_time.slice(0, 5)
						)
						?.split("-") || [schedule.start_time, schedule.end_time];

					const firstSchedule = {
						...schedule,
						quantity: 1,
						end_time: end.trim() + ":00",
					};
					const secondSchedule = {
						...schedule,
						quantity: 1,
						start_time: end.trim() + ":00",
					};
					console.log("original", schedule);
					console.log("schedule1", firstSchedule);
					console.log("schedule2", secondSchedule);
					return [...accumulator, firstSchedule, secondSchedule];
				}

				return [...accumulator, schedule];
			},
			[]
		);
		console.log(data);
		setWeekSchedulesTeacher(teacherSchedules);
	};

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

	const getTeacherClasses = async () => {
		const { data } = await api.get(`teachers/${params.teacherId}/classes/`);

		setTeacherClasses(data);
	};

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

		const { data } = await api.get(`/teachers/${params.teacherId}/schedules/month/`)

		setMonthSchedulesTeacher(data)

		setMonthSchedules(teacherMonthSchedules as any);
	};

	const getTeacherDisciplines = async () => {
		const { data } = await api.get(`teachers/${params.teacherId}/disciplines/`);

		setTeacherDisciplines(data);
	};

	const getTeacherProfile = async (date?: Date) => {
		const { data } = await api.get(`/teachers/${params.teacherId}/`);

		getMonthSchedules(date);
		getWeekSchedules(date);
		setTeacher(data);

		scheduleToShow && setScheduleToShow(undefined);
	};

	const onSelectedDateChange = (date: Date) => {
		getWeekSchedules(date);
		setSelectedDate(date);
		closeCancelScheduleModal();

		weekCalendarRef.current.getApi().gotoDate(date);
	};

	const handleOpenCancelScheduleModal = (schedule: Schedule) => {
		setShowCancelScheduleModal(true);
		setScheduleToCancel(schedule);
	};

	const handleOpenResumeScheduleModal = (canceledScheduleId: number) => {
		setShowResumeClassModal(true);
		setScheduleToResume(canceledScheduleId);
	};

	const closeCancelScheduleModal = () => {
		setScheduleToShow(undefined);
		setShowCancelScheduleModal(false);
		setScheduleToCancel(undefined);
	};

	const deleteDisciplineLink = async (linkId: number) => {
		try {
			const { data } = await api.delete(`teachers/disciplines/${linkId}/`);

			getTeacherDisciplines();
			getTeacherClasses();
			getWeekSchedules();
			getMonthSchedules();

			toast.success("Vínculo com esta disciplina foi removido");
		} catch (err) {
			toast.error("Ocorreu um erro ao tentar remover vínculo");
		}
	};

	const resumeCanceledClass = async () => {
		try {
			const response = await api.delete(
				`schedules/canceled/${scheduleToResume}/`
			);

			getTeacherProfile();
			setShowResumeClassModal(false);

			toast.success("Esta aula não está mais cancelada e ocorrerá normalmente");
		} catch {
			toast.error("Ocorreu um erro ao tentar retomar a aula");
		}
	};

	const filterSchedulesByTime = () => {
		interface Times {
			key?: Array<Schedule>;
		}

		const scheduleTimes: Times = {};

		weekSchedulesTeacher.map((item) => {
			let values = [];

			if (item.start_time in scheduleTimes) {
				// @ts-expect-error
				values.push(...scheduleTimes[item.start_time]);
				values.push(item);

				// @ts-expect-error
				scheduleTimes[item.start_time] = [...values];
			} else {
				// @ts-expect-error
				scheduleTimes[item.start_time] = [item];
			}
		});

		setScheduleByTime(scheduleTimes);
	};

	useEffect(() => {
		getTeacherProfile();
		getTeacherDisciplines();
		getAmountOfLessons();
		getTeacherClasses();
		filterSchedulesByTime();
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
				className={`bg-background-color rounded-3xl  shadow-lg absolute p-8 max-w-[370px] !h-fit w-full z-50`}
				style={{
					inset: scheduleToShow?.el?.parentElement?.style.inset,
					left:
						(scheduleToShow?.el.offsetWidth || 1) * scheduleDate.getDay() -
						(scheduleToShow?.el.offsetWidth || 1),
					top: top + (scheduleToShow?.el.offsetHeight || 0),
				}}
			>
				<section className="flex items-start justify-between">
					<h4 className="text-black font-bold text-xl">{event?.title}</h4>
					<X
						className="text-black cursor-pointer hover:opacity-60 transition-all"
						onClick={() => closeCancelScheduleModal()}
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

				<h5 className="text-black font-bold text-lg mt-6 mb-2">Turma</h5>
				<section>
					<div className="flex items-center gap-2">
						<div className="flex justify-center p-1 rounded-full items-center w-8 bg-primary-background">
							<Users size={20} className="text-primary" />
						</div>
						<span className="text-placeholder font-semibold text-sm">
							{schedule.schedule_class.course.byname}{" "}
							{schedule.schedule_class.reference_period}º{" "}
							{schedule.schedule_class.course.degree === "Ensino superior"
								? "período"
								: "ano"}{" "}
							- {schedule.schedule_class.shift}
						</span>
					</div>
				</section>

				<h5 className="text-black font-bold text-lg mt-6 mb-2">
					Professores(as)
				</h5>
				<section>
					{teachers.map((teacher) => (
						<div key={teacher.id} className="flex items-center gap-2 mb-2">
							{teacher.avatar ? (
								<div className="relative w-8 h-8">
									<Image
										src={`http://suap.ifrn.edu.br${teacher.avatar}`}
										alt={teacher.name}
										fill
										className="object-cover rounded-full"
									/>
								</div>
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

				{schedule.class_to_replace && (
					<>
						<h4 className="text-gray font-normal text-sm mt-5 mb-2 text-center">
							Neste dia, será substituída por:
						</h4>
						<section>
							<section>
								<h5 className="text-black font-bold text-lg mb-2">
									Substituto
								</h5>
								<div className="flex items-center gap-2">
									{schedule.class_to_replace.teacher.avatar ? (
										<div className="relative w-8 h-8">
											<Image
												src={`http://suap.ifrn.edu.br${schedule.class_to_replace.teacher.avatar}`}
												alt={schedule.class_to_replace.teacher.name}
												fill
												className="object-cover rounded-full"
											/>
										</div>
									) : (
										<div className="flex justify-center p-1 rounded-full items-center w-8 bg-primary-background">
											<User className="text-primary" />
										</div>
									)}
									<span className="text-placeholder font-semibold text-sm">
										{schedule.class_to_replace.teacher.name}
									</span>
								</div>
							</section>
							<section>
								<h5 className="text-black font-bold mt-3 text-lg mb-2">
									Disciplina
								</h5>
								<div className="flex items-center gap-2">
									<div className="flex justify-center p-1 rounded-full items-center w-8 bg-primary-background">
										<BookOpen size={20} className="text-primary" />
									</div>
									<span className="text-placeholder font-semibold text-sm">
										{formatDisciplineName(
											schedule.class_to_replace.discipline.name
										)}
									</span>
								</div>
							</section>
						</section>
					</>
				)}

				{new Date() <
					new Date(`${schedule.class_date} ${schedule.start_time}`) && (
						<section className="flex items-center justify-end">
							{!schedule?.canceled_class &&
								!schedule?.class_to_replace &&
								(!!teachers.find(({ id }) => id === user?.id) || hasEmployeePermissions) && (
									<Button
										onClick={() => handleOpenCancelScheduleModal(schedule)}
										color="failure"
										className="mt-4"
									>
										<Ban className="text-white mr-2 rounded-lg" />
										<span className="text-white">Cancelar aula</span>
									</Button>
								)}

							{schedule?.canceled_class &&
								hasTeacherPermissions &&
								!!teachers.find(({ id }) => id === user?.id) && (
									<Button
										onClick={() =>
											handleOpenResumeScheduleModal(schedule?.canceled_class.id)
										}
										color="warning"
										className="mt-4"
									>
										<Play fill={"white"} className="text-white mr-2 rounded-lg" />
										<span className="text-white">Retomar aula</span>
									</Button>
								)}

							{schedule?.canceled_class &&
								!schedule.class_to_replace &&
								hasTeacherPermissions &&
								!teachers.find(({ id }) => id === user?.id) && (
									<Button
										onClick={() => {
											setShowTeachCanceledClass(true);
											setClassCanceled(schedule.canceled_class);
										}}
									>
										<ClipboardSignature className="text-white mr-2 rounded-lg" />
										Ministrar aula
									</Button>
								)}
						</section>
					)}
			</div>
		);
	};

	return (
		<>
			<Modal
				title="Retomar aula"
				description="Deseja remover o cancelamento e retomar a aula neste dia?"
				openModal={showResumeClassModal}
				setOpenModal={setShowResumeClassModal}
				size="xl"
				body={
					<div className="flex items-center justify-end gap-4 pt-4">
						<Button
							color="failure"
							onClick={() => setShowResumeClassModal(false)}
						>
							Cancelar
						</Button>
						<Button
							color="sucess"
							className="bg-success text-white"
							onClick={() => resumeCanceledClass()}
						>
							Confirmar
						</Button>
					</div>
				}
			/>
			<Modal
				title="Cancelar aula"
				description="Preencha as informações abaixo para cancelar a aula selecionada"
				openModal={showCancelScheduleModal}
				setOpenModal={setShowCancelScheduleModal}
				body={
					<CancelScheduleFormModal
						closeModal={closeCancelScheduleModal}
						schedule={scheduleToCancel}
						refreshSchedules={getTeacherProfile}
					/>
				}
			/>

			<Modal
				title="Ministrar aula"
				description="Para ministrar essa aula, esperamos que os alunos desta turma estejam cientes que a aula da disciplina selecionada ocorrerá neste horário."
				openModal={showTeachCanceledClass}
				setOpenModal={setShowTeachCanceledClass}
				body={
					<TeachCanceledClassFormModal
						openModal={showTeachCanceledClass}
						setOpenModal={setShowTeachCanceledClass}
						teacherId={Number(params.teacherId)}
						classCanceled={classCanceled}
						refreshSchedules={getTeacherProfile}
					/>
				}
			/>

			<Modal
				title="Vincular disciplina"
				description="Preencha as informações abaixo para vincular uma disciplina a um professor"
				openModal={showCreateBindModal}
				setOpenModal={setShowCreateBindModal}
				body={
					<CreateDisciplineBindFormModal
						openModal={showCreateBindModal}
						setOpenModal={setShowCreateBindModal}
						teacherId={Number(params.teacherId)}
						setDisciplines={setTeacherDisciplines}
						refreshClasses={getTeacherClasses}
						refreshMonthSchedules={getMonthSchedules}
						refreshWeekSchedules={getWeekSchedules}
					/>
				}
			/>
			<Breadcrumb title="Professores">
				<section></section>
			</Breadcrumb>

			<div className="flex gap-4 items-center">
				{teacher?.avatar ? (
					<div className="relative w-16 h-16">
						<Image
							fill
							alt={teacher?.name}
							src={`https://suap.ifrn.edu.br${teacher?.avatar}`}
							className="rounded-lg object-cover"
						/>
					</div>
				) : (
					<User
						className="rounded-lg bg-primary-background w-16 p-3 h-fit"
						color="#007EA7"
					/>
				)}

				<div className="text-primary-dark">
					<p className="font-semibold">{teacher?.name}</p>
					<p className="text-sm">{teacher?.department}</p>
				</div>
			</div>

			<TeacherInformations
				teacher={teacher}
				quantityClasses={amountOfLessons}
			/>

			<Tabs.Group
				aria-label="Tabs with icons"
				style="underline"
				className="justify-end mt-3"
			>
				<Tabs.Item
					active
					icon={Clock}
					title="Horários de aula"
					className="outline-none w-full"
				>
					<div className="grid grid-cols-container gap-6">
						<div className="flex flex-col gap-y-4 min-w-fit">
							<MonthCalendar
								onDatePress={(date) => onSelectedDateChange(date)}
								onMonthViewChange={(date) => {
									setScheduleToShow(undefined);
									getMonthSchedules(date);
								}}
								events={monthSchedules}
							/>

							<PDFDownloadLink
								document={
									<ExportTeacherWeekSchedulesPDF
										teacher={teacher}
										teacherSchedules={weekSchedulesTeacher}
										schedulesByTime={scheduleByTime}
									/>
								}
								fileName={`agenda-${teacher?.name}.pdf`}
							>
								<Button
									color="gray"
									className="flex items-center justify-start bg-white p-1 rounded-lg shadow outline-none border-none min-w-[16rem] max-w-[16rem]"
								>
									<Download className="text-primary w-14 h-14 p-3 mr-1 rounded-lg bg-primary-background" />
									<div className="flex text-start flex-col">
										<p className="text-primary font-semibold text-sm">
											Exportar horários
										</p>
										<p className="text-placeholder text-xs">
											Mesmos horários em exibição
										</p>
									</div>
								</Button>
							</PDFDownloadLink>

							<PDFDownloadLink
								document={
									<ExportTeacherReport
										teacher={teacher}
										teacherMonthSchedules={monthSchedulesTeacher}
										currentDate={new Date()}
									/>
								}
								fileName={`relatorio-mensal-${teacher?.name}.pdf`}
							>
								<Button
									color="gray"
									className="flex items-center justify-start bg-white p-1 rounded-lg shadow outline-none border-none min-w-[16rem] max-w-[16rem]"
								>
									<Download className="text-primary w-14 h-14 p-3 mr-1 rounded-lg bg-primary-background" />
									<div className="flex text-start flex-col">
										<p className="text-primary font-semibold text-sm">
											Exportar relatório
										</p>
										<p className="text-placeholder text-xs">
											Relatório mensal com carga horária
										</p>
									</div>
								</Button>
							</PDFDownloadLink>

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
					<div className="flex flex-row flex-wrap gap-6 items-center justify-center">
						{teacherClasses.map(({ id, course, reference_period }) => (
							<ClassCard
								key={id}
								href={`turmas/${id}`}
								courseNickname={course.byname}
								courseGrade={course.degree}
								period={reference_period}
							/>
						))}
					</div>
				</Tabs.Item>

				<Tabs.Item icon={BookOpen} title="Disciplinas" className="outline-none">
					<div className="flex flex-row gap-6">
						{hasEmployeePermissions && (
							<Button
								color="gray"
								className="flex items-center justify-start bg-white p-1 rounded-lg shadow outline-none border-none min-w-[16rem] max-w-[16rem]"
								onClick={() => setShowCreateBindModal(true)}
							>
								<Plus className="text-primary w-14 h-14 p-3 mr-1 rounded-lg bg-primary-background" />
								<div className="flex text-start flex-col">
									<p className="text-primary font-semibold text-sm">
										Vincular disciplina
									</p>
									<p className="text-placeholder text-xs">
										Adicionar disciplina ao professor
									</p>
								</div>
							</Button>
						)}

						<div className="flex flex-col gap-y-4">
							<div className="flex flex-wrap gap-4 justify-evenly">
								{teacherDisciplines.map(({ id, discipline, course }) => (
									<DisciplineCard
										key={id}
										disciplineId={discipline.id}
										courseGrade={course.degree}
										name={discipline.name}
										period={course.period}
										isOptional={discipline.is_optional}
										courseByname={course.byname}
										isTeacherDiscipline
									>
										<DeleteModal key={id} type="teacherDiscipline">
											<Button
												key={id}
												color="sucess"
												className="bg-success text-white"
												onClick={() => deleteDisciplineLink(id)}
											>
												Confirmar
											</Button>
										</DeleteModal>
									</DisciplineCard>
								))}
							</div>
						</div>
					</div>
				</Tabs.Item>
			</Tabs.Group>
		</>
	);
}
