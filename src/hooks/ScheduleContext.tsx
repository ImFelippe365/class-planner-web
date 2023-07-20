import { CreateTeacher } from "@/interfaces/Teacher";
import { api, suapApi } from "@/services/api";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { eventColors } from "@/utils/eventColors";
import { intervalEvents } from "@/utils/intervalEvents";
import { Schedule } from "@/interfaces/Course";
import {
	CancelSchedule,
	DisciplineSchedule,
	EventSchedule,
} from "@/interfaces/Schedule";
import { formatDisciplineName } from "@/utils/formatDisciplineName";
import uuidv4 from "@/utils/uuidv4";

interface ScheduleProviderProps {
	children: React.ReactNode;
}

interface ScheduleContextValues {
	weekSchedules: EventSchedule[];
	setWeekSchedules: React.Dispatch<React.SetStateAction<EventSchedule[]>>;

	monthSchedules: EventSchedule[];
	setMonthSchedules: React.Dispatch<React.SetStateAction<EventSchedule[]>>;

	editableMode: boolean;
	setEditableMode: React.Dispatch<React.SetStateAction<boolean>>;

	getWeekSchedules: (class_id: string) => Promise<EventSchedule[]>;
	getMonthSchedules: (class_id: string) => Promise<void>;

	getTeacherWeekSchedules: (
		class_id: string,
		date?: string
	) => Promise<Schedule[]>;
	getTeacherMonthSchedules: (
		class_id: string,
		month?: number
	) => Promise<Schedule[]>;

	createSchedule: (newEvent: DisciplineSchedule) => Promise<any>;
	changeSchedule: (
		schedule_id: string,
		newEvent: DisciplineSchedule
	) => Promise<any>;
	removeSchedule: (schedule_id: string) => Promise<any>;
	cancelSchedule: (data: CancelSchedule) => Promise<any>;
}

const ScheduleContext = createContext({} as ScheduleContextValues);

const ScheduleProvider = ({ children }: ScheduleProviderProps) => {
	const [weekSchedules, setWeekSchedules] = useState<EventSchedule[]>([]);
	const [monthSchedules, setMonthSchedules] = useState<EventSchedule[]>([]);

	const [editableMode, setEditableMode] = useState(false);

	const getWeekSchedules = useCallback(async (class_id: string) => {
		try {
			const { data } = await api.get(`/classes/${class_id}/schedules/week/`);

			const schedules = data.map((schedule: Schedule) => {
				const eventColor = schedule.class_to_replace
					? eventColors.replaced
					: schedule.canceled_class
					? eventColors.canceled
					: eventColors.normal;

				const newSchedule = {
					id: schedule.id,
					title: formatDisciplineName(schedule.discipline.name),
					startTime: schedule.start_time,
					endTime: schedule.end_time,
					extendedProps: {
						discipline: schedule.discipline,
						schedule_id: schedule.id,
					},
					daysOfWeek: [schedule.weekday + 1],
					...eventColor,
				};

				return newSchedule;
			});

			setWeekSchedules([...schedules, ...(intervalEvents as any)]);

			return schedules
		} catch (error) {
			console.warn("Erro ao requisitar os horários da semana  ->", error);
		}
	}, []);

	const getMonthSchedules = useCallback(async (class_id: string) => {
		try {
			const { data } = await api.get(`/classes/${class_id}/schedules/month/`);

			setMonthSchedules(data);
		} catch (error) {
			console.warn("Erro ao requisitar os horários do mês ->", error);
		}
	}, []);

	const getTeacherWeekSchedules = useCallback(
		async (class_id: string, date?: string): Promise<Schedule[]> => {
			try {
				const { data } = await api.get(
					date
						? `/teachers/${class_id}/schedules/week/?date=${date}`
						: `/teachers/${class_id}/schedules/week/`
				);

				const schedules = data.map((schedule: Schedule) => {
					const eventColor = schedule.class_to_replace
						? eventColors.replaced
						: schedule.canceled_class
						? eventColors.canceled
						: eventColors.normal;

					const newSchedule = {
						id: schedule.id,
						title: formatDisciplineName(schedule.discipline.name),
						startTime: schedule.start_time,
						endTime: schedule.end_time,
						extendedProps: {
							schedule: schedule,
							schedule_id: schedule.id,
						},
						daysOfWeek: [schedule.weekday + 1],
						...eventColor,
					};

					return newSchedule;
				});

				return [...schedules, ...(intervalEvents as any)];
			} catch (error) {
				console.warn("Erro ao requisitar os horários da semana  ->", error);
				return [];
			}
		},
		[]
	);

	const getTeacherMonthSchedules = useCallback(
		async (class_id: string, month?: number): Promise<Schedule[]> => {
			try {
				const { data } = await api.get(
					month
						? `/teachers/${class_id}/schedules/month/?month=${month}`
						: `/teachers/${class_id}/schedules/month/`
				);

				const schedules = data
					.map((schedule: Schedule, index: number, array: Schedule[]) => {
						// const dayAlreadyHasSchedule = array
						// 	.slice(index)
						// 	.find(({ class_date }) => schedule.class_date === class_date);

						// if (!dayAlreadyHasSchedule) {
						// 	return null;
						// }

						const eventColor = schedule.class_to_replace
							? eventColors.replaced
							: schedule.canceled_class
							? eventColors.canceled
							: eventColors.normal;

						const newSchedule = {
							id: uuidv4(),
							title: formatDisciplineName(schedule.discipline.name),
							extendedProps: {
								schedule: schedule,
								schedule_id: schedule.id,
							},
							start: new Date(`${schedule.class_date} ${schedule.start_time}`),
							end: new Date(`${schedule.class_date} ${schedule.end_time}`),

							...eventColor,
						};

						return newSchedule;
					})
					.filter((item: any) => item);

				return schedules;
			} catch (error) {
				console.warn("Erro ao requisitar os horários do mês ->", error);
				return [];
			}
		},
		[]
	);

	const createSchedule = useCallback(
		async (newEvent: DisciplineSchedule): Promise<any> => {
			try {
				const response = await api.post("schedules/", newEvent);

				return response;
			} catch (error) {
				console.warn("Erro ao cadastrar horário ->", error);
			}
		},
		[]
	);

	const changeSchedule = useCallback(
		async (schedule_id: string, newEvent: DisciplineSchedule): Promise<any> => {
			try {
				const response = await api.put(`schedules/${schedule_id}/`, newEvent);

				return response;
			} catch (error) {
				console.error("Erro ao alterar horário ->", error);
			}
		},
		[]
	);

	const removeSchedule = useCallback(
		async (schedule_id: string): Promise<any> => {
			try {
				const response = await api.delete(`schedules/${schedule_id}/`);

				return response;
			} catch (error) {
				console.log("Erro ao deletar horário ->", error);
			}
		},
		[]
	);

	const cancelSchedule = useCallback(
		async (data: CancelSchedule): Promise<any> => {
			try {
				const response = await api.post(`schedules/canceled/`, data);

				return response;
			} catch (error) {
				console.log("Erro ao deletar horário ->", error);
			}
		},
		[]
	);

	const contextValues = {
		weekSchedules,
		setWeekSchedules,
		monthSchedules,
		setMonthSchedules,
		editableMode,
		setEditableMode,

		getWeekSchedules,
		getMonthSchedules,
		getTeacherWeekSchedules,
		getTeacherMonthSchedules,

		createSchedule,
		changeSchedule,
		removeSchedule,
		cancelSchedule,
	};

	return (
		<ScheduleContext.Provider value={contextValues}>
			{children}
		</ScheduleContext.Provider>
	);
};

const useSchedule = () => {
	const context = useContext(ScheduleContext);

	return context;
};

export { useSchedule, ScheduleProvider };
